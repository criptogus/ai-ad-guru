
import React from 'react';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando...</p>
      </div>
    );
  }
  
  // Show dashboard for authenticated users, landing page for others
  return user ? <DashboardPage /> : <LandingPage />;
};

export default HomePage;
