
import React from 'react';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return user ? <DashboardPage /> : <LandingPage />;
};

export default HomePage;
