import api from './axiosConfig';

export interface Image {
  id: string;
  url: string;
  complaintId: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  images?: Image[];
  response?: {
    message: string;
    timestamp: string;
  };
  responses?: {
    id: string;
    message: string;
    complaintId: string;
    responderId: string;
    responder: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    createdAt: string;
  }[];
  citizenId: string;
  citizen?: {
    id: string;
    name: string;
    email: string;
  };
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
  imagesToRemove?: string[];
}

export const complaintService = {
  // Get all complaints for the current user
  getUserComplaints: async (): Promise<Complaint[]> => {
    const response = await api.get('/api/complaints/my-complaints');
    return response.data;
  },

  // Get a single complaint by ID
  getComplaintById: async (id: string): Promise<Complaint> => {
    const response = await api.get(`/api/complaints/get-by-id/${id}`);
    return response.data;
  },

  // Create a new complaint
  createComplaint: async (complaintData: CreateComplaintDto): Promise<Complaint> => {
    try {
      // Always use FormData to handle both with and without images consistently
      const formData = new FormData();
      formData.append('title', complaintData.title);
      formData.append('description', complaintData.description);
      
      // Add images if provided (they're optional according to the backend)
      if (complaintData.images && complaintData.images.length > 0) {
        // Backend allows up to 5 images as per the route configuration: upload.array('images', 5)
        const imagesToUpload = complaintData.images.slice(0, 5);
        
        imagesToUpload.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      // Use the correct endpoint as defined in your route: router.post('/add', requireRole('CITIZEN'),...)
      const response = await api.post('/api/complaints/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Ensure cookies are sent for authentication (required for the CITIZEN role check)
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating complaint:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing complaint
  updateComplaint: async (id: string, complaintData: UpdateComplaintDto): Promise<Complaint> => {
    // Always use FormData for consistency and to handle both images and image removals
    const formData = new FormData();
    
    if (complaintData.title) {
      formData.append('title', complaintData.title);
    }
    
    if (complaintData.description) {
      formData.append('description', complaintData.description);
    }
    
    if (complaintData.images && complaintData.images.length > 0) {
      complaintData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    if (complaintData.imagesToRemove && complaintData.imagesToRemove.length > 0) {
      complaintData.imagesToRemove.forEach((imageId) => {
        formData.append('imagesToRemove', imageId);
      });
    }
    
    const response = await api.put(`/api/complaints/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Delete a complaint
  deleteComplaint: async (id: string): Promise<void> => {
    await api.delete(`/api/complaints/delete/${id}`);
  },
};
