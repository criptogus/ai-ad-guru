
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import BillingPage from './pages/BillingPage';
import ConfigPage from './pages/ConfigPage';
import AIInsightsPage from './pages/AIInsightsPage';
import UserRolesPage from './pages/UserRolesPage';
import NotFound from './pages/NotFound';
import AnalyticsPage from './pages/AnalyticsPage';
import OpenAITestPage from './pages/OpenAITestPage';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
          <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
          
          <Route path="/campaigns/create" element={<ProtectedRoute><CreateCampaignPage /></ProtectedRoute>} />
          
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          
          <Route path="/insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
          
          <Route path="/ai-insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
          
          <Route path="/settings/roles" element={<ProtectedRoute><UserRolesPage /></ProtectedRoute>} />
          
          <Route path="/config" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
          
          <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          <Route path="/debug/openai" element={<ProtectedRoute><OpenAITestPage /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
