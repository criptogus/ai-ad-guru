
import { useState, useEffect } from "react"
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

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}

export default App;
