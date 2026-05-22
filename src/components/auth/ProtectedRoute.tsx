import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not have permission, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
