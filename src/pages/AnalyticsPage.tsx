
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import AnalyticsOverview, { Campaign } from "@/components/analytics/AnalyticsOverview";

const AnalyticsPage: React.FC = () => {
  // Generate mock campaigns with the correct shape
  const campaigns = React.useMemo((): Campaign[] => {
    return [
      {
        id: "campaign-1",
        name: "Google Search Campaign",
        platform: "google",
        status: "active",
        budget: 500,
        spent: 320.45,
        clicks: 1250,
        impressions: 28400,
        conversions: 42,
        ctr: 4.4,
        startDate: "2023-08-15",
        endDate: "2023-09-15",
      },
      {
        id: "campaign-2",
        name: "Meta Awareness Campaign",
        platform: "meta",
        status: "active",
        budget: 750,
        spent: 523.78,
        clicks: 3420,
        impressions: 76500,
        conversions: 104,
        ctr: 4.47,
        startDate: "2023-08-01",
        endDate: "2023-09-01",
      },
      {
        id: "campaign-3",
        name: "Google Display Campaign",
        platform: "google",
        status: "paused",
        budget: 300,
        spent: 142.25,
        clicks: 840,
        impressions: 24600,
        conversions: 12,
        ctr: 3.41,
        startDate: "2023-07-20",
        endDate: "2023-08-20",
      },
      {
        id: "campaign-4",
        name: "Meta Video Campaign",
        platform: "meta",
        status: "active",
        budget: 600,
        spent: 382.91,
        clicks: 2180,
        impressions: 42300,
        conversions: 36,
        ctr: 5.15,
        startDate: "2023-08-10",
      },
      {
        id: "campaign-5",
        name: "Google Performance Max",
        platform: "google",
        status: "active",
        budget: 1000,
        spent: 876.32,
        clicks: 4120,
        impressions: 92400,
        conversions: 136,
        ctr: 4.46,
        startDate: "2023-07-01",
      },
      {
        id: "campaign-6",
        name: "Meta Conversion Campaign",
        platform: "meta",
        status: "paused",
        budget: 450,
        spent: 214.67,
        clicks: 1340,
        impressions: 28900,
        conversions: 23,
        ctr: 4.64,
        startDate: "2023-08-05",
        endDate: "2023-09-05",
      },
      {
        id: "campaign-7",
        name: "Google Shopping Campaign",
        platform: "google",
        status: "active",
        budget: 800,
        spent: 623.45,
        clicks: 2840,
        impressions: 54200,
        conversions: 92,
        ctr: 5.24,
        startDate: "2023-07-15",
      },
      {
        id: "campaign-8",
        name: "Meta Lead Gen Campaign",
        platform: "meta",
        status: "active",
        budget: 550,
        spent: 412.32,
        clicks: 1860,
        impressions: 38700,
        conversions: 45,
        ctr: 4.81,
        startDate: "2023-08-20",
      }
    ];
  }, []);
  
  return (
    <SafeAppLayout activePage="analytics">
      <AnalyticsOverview campaigns={campaigns} />
    </SafeAppLayout>
  );
};

export default AnalyticsPage;
