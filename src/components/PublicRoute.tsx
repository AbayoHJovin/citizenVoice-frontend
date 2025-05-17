
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean;
}

const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
