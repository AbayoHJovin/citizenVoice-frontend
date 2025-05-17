
import { Role } from '../features/auth/authSlice';

export const isUserAllowed = (userRole: Role | undefined, allowedRoles: Role[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
