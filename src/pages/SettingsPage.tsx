
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import CompanyInfoSettings from "@/components/settings/CompanyInfoSettings";
import ConnectionsSettings from "@/components/settings/ConnectionsSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/settings/')[1] || 'company';

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <SafeAppLayout activePage="settings">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="w-full max-w-4xl mb-2">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <CompanyInfoSettings />
          </TabsContent>
          
          <TabsContent value="connections">
            <ConnectionsSettings />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default SettingsPage;
