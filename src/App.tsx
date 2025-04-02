
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme.tsx';
import { Toaster } from '@/components/ui/toaster';
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

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <AuthProvider>
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
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/campaigns" element={
            <ProtectedRoute>
              <AppLayout>
                <CampaignsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/create-campaign" element={
            <ProtectedRoute>
              <AppLayout>
                <CreateCampaignPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AppLayout>
                <AnalyticsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/credits-info" element={
            <ProtectedRoute>
              <AppLayout>
                <CreditsInfoPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings/*" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <AppLayout>
                <BillingPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/website-analysis" element={
            <ProtectedRoute>
              <AppLayout>
                <WebsiteAnalysisPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/campaign/:campaignId" element={
            <ProtectedRoute>
              <AppLayout>
                <CampaignPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing" element={
            <ProtectedRoute>
              <AppLayout>
                <TestAdsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/template-example" element={
            <ProtectedRoute>
              <AppLayout>
                <TemplateExamplePage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/connections" element={
            <ProtectedRoute>
              <AppLayout>
                <ConnectionsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/callback" element={
            <ProtectedRoute>
              <OAuthCallbackHandler />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
