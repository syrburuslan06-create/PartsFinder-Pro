import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext, UserRole } from '../contexts/AppContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireEmail?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, requireEmail }) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict check for Super Admin email if specified
  if (requireEmail && currentUser.email !== requireEmail) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
