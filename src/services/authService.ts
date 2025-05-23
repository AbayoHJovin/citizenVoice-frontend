
import api from './axiosConfig';
import { User } from '../features/auth/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
}

export interface AuthResponse {
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string, confirmNewPassword: string) => {
    const response = await api.post('/api/auth/reset-password', { token, newPassword, confirmNewPassword });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me', {
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  
  updateProfile: async (profileData: {
    name: string;
    province?: string;
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
  }) => {
    // Create the request data with address field structure as expected by the backend
    const requestData: {
      name: string;
      address: {
        province?: string;
        district?: string;
        sector?: string;
        cell?: string;
        village?: string;
      };
    } = {
      name: profileData.name,
      address: {}
    };
    
    // Only add address fields if they are provided
    if (profileData.province) requestData.address.province = profileData.province;
    if (profileData.district) requestData.address.district = profileData.district;
    if (profileData.sector) requestData.address.sector = profileData.sector;
    if (profileData.cell) requestData.address.cell = profileData.cell;
    if (profileData.village) requestData.address.village = profileData.village;
    
    const response = await api.put('/api/auth/update', requestData);
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/api/auth/me');
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
