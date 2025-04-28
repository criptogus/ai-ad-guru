
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../hooks/adConnections/utils/navigationUtils';

interface NavigationSetupProps {
  children: React.ReactNode;
}

/**
 * A component that sets up the navigation function for use across the app
 */
export const NavigationSetup: React.FC<NavigationSetupProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Initialize the navigation utility
  useEffect(() => {
    setNavigate(navigate);
    console.log("Navigation utility initialized");
  }, [navigate]);

  return <>{children}</>;
};
