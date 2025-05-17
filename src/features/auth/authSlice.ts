
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginCredentials, RegisterCredentials } from '../../services/authService';
import { toast } from 'react-toastify';

export type Role = 'CITIZEN' | 'LEADER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  administrationScope?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!localStorage.getItem('user'), // Now we determine authentication by user presence
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Only store user data in localStorage, tokens are in HTTP-only cookies
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to login';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      // Don't store token and user data since we're redirecting to login
      toast.success('Registration successful! Please login to continue.');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call the logout endpoint to clear cookies on the server side
      await authService.logout();
      // Clear user data from localStorage
      localStorage.removeItem('user');
      // Clear the auth check flag from sessionStorage
      sessionStorage.removeItem('authChecked');
      return null;
    } catch (error: any) {
      // Even if the API call fails, we should still clear local storage and session storage
      localStorage.removeItem('user');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      toast.success('Reset email sent! Check your inbox.');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, password);
      toast.success('Password reset successful! Please login with your new password.');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      // Verify authentication by fetching the current user
      const response = await authService.getCurrentUser();
      
      // The backend returns user data including location information
      const userData: User = {
        id: '', // The ID isn't returned from /me endpoint
        name: response.name,
        email: response.email,
        role: response.role as Role,
        // Include location data if available
        province: response.province,
        district: response.district,
        sector: response.sector,
        cell: response.cell,
        village: response.village,
        administrationScope: response.administrationScope
      };
      
      // If successful, update localStorage with the latest user data
      localStorage.setItem('user', JSON.stringify(userData));
      return { user: userData };
    } catch (error: any) {
      // If there's an error, clear user data
      localStorage.removeItem('user');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

export interface UpdateProfileData {
  name: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: UpdateProfileData, { rejectWithValue, getState }) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      // Get current user from state
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;
      
      if (currentUser) {
        // Update user in localStorage with new profile data
        const updatedUser: User = {
          ...currentUser,
          name: profileData.name,
          province: profileData.province,
          district: profileData.district,
          sector: profileData.sector,
          cell: profileData.cell,
          village: profileData.village,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      }
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Don't set user or token since we're redirecting to login
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
