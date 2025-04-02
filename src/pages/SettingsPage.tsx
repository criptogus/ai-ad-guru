
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CompanyInfoSettings from "@/components/settings/CompanyInfoSettings";
import ConnectionsSettings from "@/components/settings/ConnectionsSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import TeamSettings from "@/components/settings/TeamSettings";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/settings/')[1] || 'company';

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <AppLayout activePage="settings">
      <div className="w-full h-full px-6 py-6 overflow-y-auto">
        <div className="max-w-full mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="mb-4">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <Routes>
              <Route path="/" element={<CompanyInfoSettings />} />
              <Route path="/company" element={<CompanyInfoSettings />} />
              <Route path="/team" element={<TeamSettings />} />
              <Route path="/connections" element={<ConnectionsSettings />} />
              <Route path="/appearance" element={<AppearanceSettings />} />
              <Route path="/notifications" element={<NotificationsSettings />} />
            </Routes>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
