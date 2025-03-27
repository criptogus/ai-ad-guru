
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import TestAdsPage from "./pages/TestAdsPage";
import InstagramTemplateExamplePage from "./pages/InstagramTemplateExamplePage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import BillingPage from "./pages/BillingPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/test-ads" element={<TestAdsPage />} />
          <Route path="/template-example" element={<InstagramTemplateExamplePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
