import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { complaintService, Complaint, CreateComplaintDto, UpdateComplaintDto } from '../../services/complaintService';
import { toast } from 'react-toastify';

interface ComplaintsState {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ComplaintsState = {
  complaints: [],
  selectedComplaint: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserComplaints = createAsyncThunk(
  'complaints/fetchUserComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const complaints = await complaintService.getUserComplaints();
      return complaints;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch complaints';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  'complaints/fetchComplaintById',
  async (id: string, { rejectWithValue }) => {
    try {
      const complaint = await complaintService.getComplaintById(id);
      return complaint;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch complaint';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/createComplaint',
  async (complaintData: CreateComplaintDto, { rejectWithValue }) => {
    try {
      const complaint = await complaintService.createComplaint(complaintData);
      toast.success('Complaint submitted successfully');
      return complaint;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create complaint';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateComplaint = createAsyncThunk(
  'complaints/updateComplaint',
  async ({ id, data }: { id: string; data: UpdateComplaintDto }, { rejectWithValue }) => {
    try {
      const complaint = await complaintService.updateComplaint(id, data);
      toast.success('Complaint updated successfully');
      return complaint;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update complaint';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  'complaints/deleteComplaint',
  async (id: string, { rejectWithValue }) => {
    try {
      await complaintService.deleteComplaint(id);
      toast.success('Complaint deleted successfully');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete complaint';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setSelectedComplaint: (state, action: PayloadAction<Complaint | null>) => {
      state.selectedComplaint = action.payload;
    },
    clearComplaints: (state) => {
      state.complaints = [];
      state.selectedComplaint = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user complaints
    builder
      .addCase(fetchUserComplaints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserComplaints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchUserComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch complaint by ID
      .addCase(fetchComplaintById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedComplaint = action.payload;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create complaint
      .addCase(createComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints.push(action.payload);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update complaint
      .addCase(updateComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.complaints.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.selectedComplaint?.id === action.payload.id) {
          state.selectedComplaint = action.payload;
        }
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete complaint
      .addCase(deleteComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = state.complaints.filter(c => c.id !== action.payload);
        if (state.selectedComplaint?.id === action.payload) {
          state.selectedComplaint = null;
        }
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedComplaint, clearComplaints } = complaintsSlice.actions;
export default complaintsSlice.reducer;
