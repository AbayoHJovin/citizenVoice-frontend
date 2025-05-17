import api from './axiosConfig';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  images?: string[];
  response?: {
    message: string;
    timestamp: string;
  };
  citizenId: string;
}

export interface CreateComplaintDto {
  title: string;
  description: string;
  images?: File[];
}

export interface UpdateComplaintDto {
  title?: string;
  description?: string;
  images?: File[];
}

export const complaintService = {
  // Get all complaints for the current user
  getUserComplaints: async (): Promise<Complaint[]> => {
    const response = await api.get('/api/complaints/user');
    return response.data;
  },

  // Get a single complaint by ID
  getComplaintById: async (id: string): Promise<Complaint> => {
    const response = await api.get(`/api/complaints/${id}`);
    return response.data;
  },

  // Create a new complaint
  createComplaint: async (complaintData: CreateComplaintDto): Promise<Complaint> => {
    // If there are images, we need to use FormData
    if (complaintData.images && complaintData.images.length > 0) {
      const formData = new FormData();
      formData.append('title', complaintData.title);
      formData.append('description', complaintData.description);
      
      complaintData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      const response = await api.post('/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // No images, just send JSON
      const response = await api.post('/api/complaints', complaintData);
      return response.data;
    }
  },

  // Update an existing complaint
  updateComplaint: async (id: string, complaintData: UpdateComplaintDto): Promise<Complaint> => {
    // If there are images, we need to use FormData
    if (complaintData.images && complaintData.images.length > 0) {
      const formData = new FormData();
      
      if (complaintData.title) {
        formData.append('title', complaintData.title);
      }
      
      if (complaintData.description) {
        formData.append('description', complaintData.description);
      }
      
      complaintData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      const response = await api.put(`/api/complaints/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // No images, just send JSON
      const response = await api.put(`/api/complaints/${id}`, complaintData);
      return response.data;
    }
  },

  // Delete a complaint
  deleteComplaint: async (id: string): Promise<void> => {
    await api.delete(`/api/complaints/${id}`);
  },
};
