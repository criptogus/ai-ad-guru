
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme.tsx'; // Fixed import path to use the TSX file with ThemeProvider
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
import ConnectionsSection from './components/config/ConnectionsSection';
import OAuthCallbackHandler from './components/config/OAuthCallbackHandler';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/mfa-verification" element={<MFAPage />} />
            <Route path="/" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute requiresPayment={false}><AppLayout><BillingPage /></AppLayout></ProtectedRoute>} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/website-analysis" element={<ProtectedRoute><AppLayout><WebsiteAnalysisPage /></AppLayout></ProtectedRoute>} />
            <Route path="/campaign/:campaignId" element={<ProtectedRoute><AppLayout><CampaignPage /></AppLayout></ProtectedRoute>} />
            <Route path="/testing" element={<ProtectedRoute><AppLayout><TestAdsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/template-example" element={<ProtectedRoute><AppLayout><TemplateExamplePage /></AppLayout></ProtectedRoute>} />
            <Route
              path="/connections"
              element={<ProtectedRoute><ConnectionsSection /></ProtectedRoute>}
            />

            <Route
              path="/callback"
              element={<ProtectedRoute><OAuthCallbackHandler /></ProtectedRoute>}
            />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
