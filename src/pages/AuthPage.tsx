
import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AuthPage serves as a container for authentication-related routes
 */
const AuthPage: React.FC = () => {  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Outlet />
    </div>
  );
};

export default AuthPage;
