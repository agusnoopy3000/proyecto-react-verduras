import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.warning('⚠️ Debes iniciar sesión para acceder a esta página');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
