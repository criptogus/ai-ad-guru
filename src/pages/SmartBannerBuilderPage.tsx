
import React from "react";
import AppLayout from "@/components/AppLayout";
import SmartBannerBuilder from "@/components/smart-banner/SmartBannerBuilder";

const SmartBannerBuilderPage: React.FC = () => {
  return (
    <AppLayout activePage="smart-banner">
      <SmartBannerBuilder />
    </AppLayout>
  );
};

export default SmartBannerBuilderPage;
