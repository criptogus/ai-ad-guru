
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import SmartBannerBuilder from "@/components/smart-banner/SmartBannerBuilder";

const SmartBannerPage: React.FC = () => {
  return (
    <SafeAppLayout activePage="smart-banner">
      <SmartBannerBuilder />
    </SafeAppLayout>
  );
};

export default SmartBannerPage;
