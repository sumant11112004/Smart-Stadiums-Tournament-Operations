import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sports-grayBg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sports-blue border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Admin access restricted, redirect to home page
    console.warn('⚠️ Access Denied: User role is not administrator.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
