
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountConnections from "@/components/config/AccountConnections";

const ConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connections");

  return (
    <AppLayout activePage="config">
      <div className="w-full p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Configuration</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="connections">Ad Platform Connections</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections">
              <AccountConnections />
            </TabsContent>
            
            <TabsContent value="billing">
              <div className="border p-6 rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Billing settings will be available soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="border p-6 rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">User management will be available soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default ConfigPage;
