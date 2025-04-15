
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignListPage from './pages/CampaignListPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import AdAccountsPage from './pages/AdAccountsPage';
import BillingPage from './pages/BillingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';
import PromptTemplatePage from './pages/PromptTemplatePage';
import MetaAdGeneratorPage from './pages/MetaAdGeneratorPage';

// Import contexts and providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { CreditsProvider } from './contexts/CreditsContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CreditsProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/create-campaign" element={<CreateCampaignPage />} />
              <Route path="/campaigns" element={<CampaignListPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/ad-accounts" element={<AdAccountsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/tools/templates" element={<PromptTemplatePage />} />
              <Route path="/tools/meta-ad-generator" element={<MetaAdGeneratorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster />
          </CreditsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
