
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UsageTab, 
  PlansTab, 
  InfoTab, 
  CreditPageHeader, 
  CreditSystemAlert 
} from "@/components/credits";

const CreditsInfoPage = () => {
  return (
    <AppLayout activePage="credits">
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <CreditPageHeader />
        <CreditSystemAlert />
        
        <Tabs defaultValue="usages" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="usages">Credit Usage</TabsTrigger>
            <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
            <TabsTrigger value="info">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usages">
            <UsageTab />
          </TabsContent>
          
          <TabsContent value="plans">
            <PlansTab />
          </TabsContent>
          
          <TabsContent value="info">
            <InfoTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CreditsInfoPage;
