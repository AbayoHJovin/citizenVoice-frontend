
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean;
}

const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  // For public routes, we don't check authentication with the server
  // We only use what's already in the Redux store
  const { isAuthenticated, user } = useAuth(false);

  // If authenticated and route is restricted, redirect based on role
  if (isAuthenticated && restricted) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'LEADER') {
      return <Navigate to="/leader/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
