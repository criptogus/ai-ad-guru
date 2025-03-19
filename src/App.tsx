
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "@/components/ProtectedRoute";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CampaignsPage from "@/pages/CampaignsPage";
import CreateCampaignPage from "@/pages/CreateCampaignPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ConfigPage from "@/pages/ConfigPage";
import BillingPage from "@/pages/BillingPage";
import ProfilePage from "@/pages/ProfilePage";
import AIInsightsPage from "@/pages/AIInsightsPage";
import UserRolesPage from "@/pages/UserRolesPage";
import TestAdsPage from "@/pages/TestAdsPage";
import NotFound from "@/pages/NotFound";

import "./App.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="adguru-theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
            <Route path="/campaigns/create" element={<ProtectedRoute><CreateCampaignPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/config" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserRolesPage /></ProtectedRoute>} />
            <Route path="/test-ads" element={<ProtectedRoute><TestAdsPage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
