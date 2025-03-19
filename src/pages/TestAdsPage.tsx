
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import MetaAdsTestArea from "@/components/testing/MetaAdsTestArea";
import GoogleAdsTestArea from "@/components/testing/GoogleAdsTestArea";

const TestAdsPage: React.FC = () => {
  return (
    <AppLayout activePage="test">
      <div className="container mx-auto py-6 space-y-4">
        <h1 className="text-2xl font-bold">Ads Testing Area</h1>
        <p className="text-muted-foreground">Debug and troubleshoot ad generation and display issues</p>
        
        <Tabs defaultValue="meta" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="meta">Meta Ads Test</TabsTrigger>
            <TabsTrigger value="google">Google Ads Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meta" className="mt-4">
            <MetaAdsTestArea />
          </TabsContent>
          
          <TabsContent value="google" className="mt-4">
            <GoogleAdsTestArea />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TestAdsPage;
