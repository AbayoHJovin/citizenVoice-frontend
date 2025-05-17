
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Role } from '../features/auth/authSlice';
import { isUserAllowed } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './ui/loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  // For protected routes, we explicitly check authentication status
  const { isAuthenticated, user, isLoading, authChecked } = useAuth(true);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified but user doesn't have the required role
  if (allowedRoles.length > 0 && !isUserAllowed(user?.role, allowedRoles)) {
    // Show unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
