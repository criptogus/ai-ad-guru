
import React from "react";
import AppLayout from "@/components/AppLayout";
import { generateMockCampaigns } from "@/models/CampaignTypes";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";

const AnalyticsPage: React.FC = () => {
  const campaigns = React.useMemo(() => {
    return generateMockCampaigns(8);
  }, []);
  
  return (
    <AppLayout activePage="analytics">
      <AnalyticsOverview campaigns={campaigns} />
    </AppLayout>
  );
};

export default AnalyticsPage;
