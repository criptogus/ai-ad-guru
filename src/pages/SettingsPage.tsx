
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import CompanyInfoSettings from "@/components/settings/CompanyInfoSettings";
import ConnectionsSettings from "@/components/settings/ConnectionsSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";

const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/settings/')[1] || 'company';

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <SafeAppLayout activePage="settings">
      <div className="container mx-auto p-6 max-w-7xl w-full">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="w-full max-w-4xl mb-2">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <Routes>
            <Route path="/" element={<CompanyInfoSettings />} />
            <Route path="/company" element={<CompanyInfoSettings />} />
            <Route path="/connections" element={<ConnectionsSettings />} />
            <Route path="/appearance" element={<AppearanceSettings />} />
            <Route path="/notifications" element={<NotificationsSettings />} />
          </Routes>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default SettingsPage;
