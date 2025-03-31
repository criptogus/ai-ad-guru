
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

/**
 * AuthPage serves as a container for authentication-related routes
 */
const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-900">
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Default redirect to login page */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </div>
  );
};

export default AuthPage;
