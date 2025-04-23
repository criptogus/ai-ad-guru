
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import SettingsPage from "./pages/SettingsPage";
import ConfigPage from "./pages/ConfigPage";
import CreditsInfoPage from "./pages/CreditsInfoPage";
import BillingPage from "./pages/BillingPage";
import NotFound from "./pages/NotFound";
import BillingHistoryPage from "@/pages/BillingHistoryPage";
import ProtectedRoute from './components/ProtectedRoute';
import { setNavigate } from './hooks/adConnections/utils/navigationUtils';
import AnalyticsPage from './pages/AnalyticsPage';
import ConnectionsPage from './pages/ConnectionsPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';

function App() {
  const navigate = useNavigate();
  
  // Initialize the navigation utility
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
      <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaignPage /></ProtectedRoute>} />
      <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/config" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
      <Route path="/credits" element={<ProtectedRoute><CreditsInfoPage /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
      <Route path="/billing/history" element={<ProtectedRoute><BillingHistoryPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
