
import { useEffect } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import "./App.css";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ConfigPage from "./pages/ConfigPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import BillingPage from "./pages/BillingPage";
import CreditsInfoPage from "./pages/CreditsInfoPage";
import UserRolesPage from "./pages/UserRolesPage";
import TestConnectionsPage from "./pages/TestConnectionsPage";

function App() {
  useEffect(() => {
    // Debug logs for component mounting
    console.log("App component mounted");
    
    // Log the current location to help with debugging routing issues
    console.log("Current pathname:", window.location.pathname);
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Landing and authentication routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Application routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<Navigate to="/settings/company" replace />} />
        <Route path="/settings/:tab" element={<SettingsPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/credits-info" element={<CreditsInfoPage />} />
        <Route path="/roles" element={<UserRolesPage />} />
        <Route path="/team" element={<UserRolesPage />} />
        <Route path="/test-connections" element={<TestConnectionsPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}

export default App;
