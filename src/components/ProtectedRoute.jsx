import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTheatreStore } from '../store/useTheatreStore';

/**
 * ProtectedRoute handles both authentication and role-based access.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {Array<string>} props.allowedRoles - Optional list of roles that can access this route
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const user = useTheatreStore((state) => state.user);
  const location = useLocation();

  // 1. Check if user is logged in
  if (!user) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login-medallion-theatre" state={{ from: location }} replace />;
  }

  // 2. Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is a clerk and tries to access manager-only page, redirect to clerk dashboard
    // Alternatively, we could show an "Access Denied" page.
    return <Navigate to="/clerk-dashboard" replace />;
  }

  return children;
}
