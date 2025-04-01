
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Removed BrowserRouter import
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
        {/* Removed the Router component since it's already in main.tsx */}
        <Routes>
          {/* Landing page as the root path */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* Handle both OAuth redirect paths */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route path="/mfa-verification" element={<MFAPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
          <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute requiresPayment={false}><AppLayout><BillingPage /></AppLayout></ProtectedRoute>} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/website-analysis" element={<ProtectedRoute><AppLayout><WebsiteAnalysisPage /></AppLayout></ProtectedRoute>} />
          <Route path="/campaign/:campaignId" element={<ProtectedRoute><AppLayout><CampaignPage /></AppLayout></ProtectedRoute>} />
          <Route path="/testing" element={<ProtectedRoute><AppLayout><TestAdsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/template-example" element={<ProtectedRoute><AppLayout><TemplateExamplePage /></AppLayout></ProtectedRoute>} />
          
          {/* Keep the connections route with AppLayout */}
          <Route path="/connections" element={<ProtectedRoute><AppLayout><ConnectionsPage /></AppLayout></ProtectedRoute>} />
          
          {/* Update callback route to use ProtectedRoute but NOT wrapped in AppLayout 
             to prevent duplicate UI elements during OAuth flow */}
          <Route path="/callback" element={<ProtectedRoute><OAuthCallbackHandler /></ProtectedRoute>} />
          
          {/* Public pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/zero-agency-privacy-policy" element={<ZeroAgencyPrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
