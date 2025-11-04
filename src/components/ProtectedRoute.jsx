import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl text-cyan-600">Loading...</h1>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect them to the /login page, preserving the location they were trying to go to.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}