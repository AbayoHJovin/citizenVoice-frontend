import api from '../services/axiosConfig';
import { store } from '../redux/store';
import { checkAuthStatus } from '../features/auth/authSlice';

/**
 * Utility function to refresh the access token
 * This can be called when an API request fails with a 401 error
 * It will attempt to use the refresh token to get a new access token
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    // Call the refresh token endpoint
    // The server will use the refresh token cookie to generate a new access token
    await api.post('/api/auth/refresh');
    
    // If successful, update the auth state with the new user info
    await store.dispatch(checkAuthStatus()).unwrap();
    
    return true;
  } catch (error) {
    // If refresh fails, the user needs to log in again
    return false;
  }
};
