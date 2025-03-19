
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';

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
import NotFound from './pages/NotFound';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <CampaignsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/create-campaign" element={
              <ProtectedRoute>
                <CreateCampaignPage />
              </ProtectedRoute>
            } />
            
            <Route path="/billing" element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } />

            <Route path="/config" element={
              <ProtectedRoute>
                <ConfigPage />
              </ProtectedRoute>
            } />
            
            <Route path="/insights" element={
              <ProtectedRoute>
                <AIInsightsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/ai-insights" element={
              <ProtectedRoute>
                <AIInsightsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
