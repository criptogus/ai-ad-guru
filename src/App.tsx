
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@/hooks/use-theme';

import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import BillingPage from './pages/BillingPage';
import PricingPage from './pages/PricingPage';
import WebsiteAnalysisPage from './pages/WebsiteAnalysisPage';
import CampaignPage from './pages/CampaignPage';
import CampaignsPage from './pages/CampaignsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CreditsInfoPage from './pages/CreditsInfoPage';
import TestAdsPage from './pages/TestAdsPage';
import TemplateExamplePage from './pages/TemplateExamplePage';
import MFAPage from './pages/MFAPage';
import ConnectionsPage from './pages/ConnectionsPage';
import OAuthCallbackHandler from './components/config/OAuthCallbackHandler';
import AuthCallback from './components/auth/AuthCallback';
import LandingPage from './pages/LandingPage';
import ZeroAgencyPrivacyPolicyPage from './pages/ZeroAgencyPrivacyPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import SupportPage from './pages/SupportPage';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    // Add any necessary side effects here
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <AuthProvider>
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Your description here" />
          </Helmet>
          <Toaster />
          <Routes>
            {/* Public routes that don't require authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/zero-agency-privacy-policy" element={<ZeroAgencyPrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            
            {/* Authentication routes */}
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/mfa-verification" element={<MFAPage />} />
            
            {/* Protected routes requiring authentication */}
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
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/credits-info" element={
              <ProtectedRoute>
                <CreditsInfoPage />
              </ProtectedRoute>
            } />
            <Route path="/settings/*" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } />
            <Route path="/website-analysis" element={
              <ProtectedRoute>
                <WebsiteAnalysisPage />
              </ProtectedRoute>
            } />
            <Route path="/campaign/:campaignId" element={
              <ProtectedRoute>
                <CampaignPage />
              </ProtectedRoute>
            } />
            <Route path="/testing" element={
              <ProtectedRoute>
                <TestAdsPage />
              </ProtectedRoute>
            } />
            <Route path="/template-example" element={
              <ProtectedRoute>
                <TemplateExamplePage />
              </ProtectedRoute>
            } />
            <Route path="/connections" element={
              <ProtectedRoute>
                <ConnectionsPage />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } />
            
            <Route path="/callback" element={
              <ProtectedRoute>
                <OAuthCallbackHandler />
              </ProtectedRoute>
            } />
            
            {/* Redirect /roles to /settings/team */}
            <Route path="/roles" element={
              <ProtectedRoute>
                <Navigate to="/settings/team" replace />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
