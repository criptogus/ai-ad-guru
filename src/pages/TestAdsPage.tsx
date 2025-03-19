
import React from "react";
import AppLayout from "@/components/AppLayout";
import MetaAdsTestArea from "@/components/testing/MetaAdsTestArea";

const TestAdsPage: React.FC = () => {
  return (
    <AppLayout activePage="test">
      <div className="container mx-auto py-6 space-y-4">
        <h1 className="text-2xl font-bold">Ads Testing Area</h1>
        <p className="text-muted-foreground">Debug and troubleshoot ad generation and display issues</p>
        
        <div className="mt-6">
          <MetaAdsTestArea />
        </div>
      </div>
    </AppLayout>
  );
};

export default TestAdsPage;
