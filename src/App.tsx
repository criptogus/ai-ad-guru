
import React, { useState, useEffect } from "react";
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Here you would check for a token in local storage or cookies
    const token = localStorage.getItem("authToken"); // Example
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <ThemeProvider>
      <div className="app">
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test-ads" element={<TestAdsPage />} />
          <Route path="/template-example" element={<InstagramTemplateExamplePage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
