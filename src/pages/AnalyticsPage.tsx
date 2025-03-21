
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { generateMockCampaigns } from "@/models/CampaignTypes";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";

const AnalyticsPage: React.FC = () => {
  const campaigns = React.useMemo(() => {
    return generateMockCampaigns(8);
  }, []);
  
  return (
    <SafeAppLayout activePage="analytics">
      <AnalyticsOverview campaigns={campaigns} />
    </SafeAppLayout>
  );
};

export default AnalyticsPage;
