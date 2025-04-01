
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
            <ProtectedRoute requiresPayment={true}>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings/*" element={
            <ProtectedRoute requiresPayment={true}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute requiresPayment={false}>
              <AppLayout>
                <BillingPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/website-analysis" element={
            <ProtectedRoute requiresPayment={true}>
              <AppLayout>
                <WebsiteAnalysisPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/campaign/:campaignId" element={
            <ProtectedRoute requiresPayment={true}>
              <AppLayout>
                <CampaignPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing" element={
            <ProtectedRoute requiresPayment={true}>
              <AppLayout>
                <TestAdsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/template-example" element={
            <ProtectedRoute requiresPayment={true}>
              <AppLayout>
                <TemplateExamplePage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/connections" element={
            <ProtectedRoute requiresPayment={true}>
              <AppLayout>
                <ConnectionsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/callback" element={
            <ProtectedRoute requiresPayment={false}>
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
