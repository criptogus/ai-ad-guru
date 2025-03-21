
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import SmartBannerBuilderPage from "./pages/SmartBannerBuilderPage";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/create-campaign" element={<CreateCampaignPage />} />
            <Route path="/smart-banner-builder" element={<SmartBannerBuilderPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
