import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  return children || <Outlet />;
};

export default React.memo(ProtectedRoute); 