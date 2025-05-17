import { apiUrl } from '@/lib/apiUrl';
import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Request interceptor for handling request configurations
api.interceptors.request.use(
  (config) => {
    // No need to manually add Authorization header
    // The browser will automatically include cookies with requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Only attempt refresh if this is an API request (not a static asset)
      // And don't redirect on auth endpoints to avoid infinite loops
      const isApiRequest = originalRequest.url && !originalRequest.url.includes('/assets/');
      const isAuthEndpoint = originalRequest.url && (
        originalRequest.url.includes('/auth/login') || 
        originalRequest.url.includes('/auth/register') ||
        originalRequest.url.includes('/auth/me')
      );
      
      if (isApiRequest && !isAuthEndpoint) {
        try {
          // Attempt to refresh the token
          const refreshResult = await import('../utils/refreshToken').then(module => {
            return module.refreshAccessToken();
          });
          
          if (refreshResult) {
            // If refresh was successful, retry the original request
            return api(originalRequest);
          } else {
            // If refresh failed, clear auth state but don't redirect automatically
            // This prevents redirects on public pages
            localStorage.removeItem('user');
            sessionStorage.removeItem('authChecked');
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // If there's an error during refresh, clear auth state
          localStorage.removeItem('user');
          sessionStorage.removeItem('authChecked');
          return Promise.reject(error);
        }
      }
    }
    
    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;
