
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import SettingsPage from "./pages/SettingsPage";
import ConfigPage from "./pages/ConfigPage";
import CreditsInfoPage from "./pages/CreditsInfoPage";
import BillingPage from "./pages/BillingPage";
import NotFoundPage from "./pages/NotFoundPage";
import BillingHistoryPage from "@/pages/BillingHistoryPage";
import ProtectedRoute from './components/ProtectedRoute';
import { setNavigate } from './hooks/adConnections/utils/navigationUtils';
import AnalyticsPage from './pages/AnalyticsPage';
import ConnectionsPage from './pages/ConnectionsPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SupportPage from './pages/SupportPage';
import AdManagerPage from "./pages/AdManagerPage";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  
  // Initialize the navigation utility
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  // This component is no longer used for routing
  // The routing is now handled by router.tsx
  return <></>;
}

export default App;
