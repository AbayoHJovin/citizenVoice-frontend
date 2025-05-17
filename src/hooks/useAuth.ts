import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { checkAuthStatus } from '../features/auth/authSlice';

/**
 * Custom hook to handle authentication verification
 * Only verifies authentication once per session to avoid unnecessary API calls
 */
export const useAuth = (checkOnMount = false) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only check authentication if explicitly requested (for protected routes)
    if (checkOnMount) {
      // Use a session storage flag to track if we've already checked auth
      const hasCheckedAuth = sessionStorage.getItem('authChecked');
      
      if (!hasCheckedAuth && !isAuthenticated) {
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            // Mark that we've checked auth this session
            sessionStorage.setItem('authChecked', 'true');
            setAuthChecked(true);
          })
          .catch(() => {
            // Even on error, mark as checked to avoid repeated failed calls
            sessionStorage.setItem('authChecked', 'true');
            setAuthChecked(true);
          });
      } else {
        setAuthChecked(true);
      }
    } else {
      // For public routes, we don't need to check authentication
      setAuthChecked(true);
    }
  }, [dispatch, isAuthenticated, checkOnMount]);

  return {
    user,
    isAuthenticated,
    isLoading,
    authChecked
  };
};
