import { apiUrl } from '../lib/apiUrl';
import axios from 'axios';

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This enables sending cookies with cross-origin requests
});

api.interceptors.request.use(
  (config) => {
    // Ensure credentials are included in every request
    config.withCredentials = true;
    
    // Set additional headers if needed
    // Use the proper method to set headers in Axios v1.0.0+
    config.headers.set('X-Requested-With', 'XMLHttpRequest');
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const isApiRequest = originalRequest.url && !originalRequest.url.includes('/assets/');
      const isAuthEndpoint = originalRequest.url && (
        originalRequest.url.includes('/auth/login') || 
        originalRequest.url.includes('/auth/register') ||
        originalRequest.url.includes('/auth/me')
      );
      
      if (isApiRequest && !isAuthEndpoint) {
        try {
          const refreshResult = await import('../utils/refreshToken').then(module => {
            return module.refreshAccessToken();
          });
          
          if (refreshResult) {
            
            return api(originalRequest);
          } else {
            
            localStorage.removeItem('user');
            sessionStorage.removeItem('authChecked');
            return Promise.reject(error);
          }
        } catch (refreshError) {
          localStorage.removeItem('user');
          sessionStorage.removeItem('authChecked');
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
