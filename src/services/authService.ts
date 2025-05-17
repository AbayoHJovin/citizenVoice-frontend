
import axios from 'axios';
import { User } from '../features/auth/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axios.post('/auth/register', credentials);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await axios.post('/auth/reset-password', { token, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await axios.get<User>('/auth/me');
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
