
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";

const SmartBannerPage: React.FC = () => {
  return (
    <SafeAppLayout activePage="smart-banner">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Smart Banner Creator</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Smart Banner creation tool coming soon.</p>
        </div>
      </div>
    </SafeAppLayout>
  );
};

export default SmartBannerPage;
