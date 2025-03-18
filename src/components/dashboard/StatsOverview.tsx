
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Campaign } from "@/models/CampaignTypes";

interface StatsOverviewProps {
  campaigns: Campaign[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ campaigns }) => {
  // Calculate dashboard stats
  const totalImpressions = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.impressions || 0), 0);
  
  const totalClicks = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.clicks || 0), 0);
  
  const avgCTR = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;
  
  const totalSpend = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.spend || 0), 0);

  // Calculate month-over-month growth (mock data)
  const previousMonthSpend = totalSpend * 0.8;
  const spendGrowth = ((totalSpend - previousMonthSpend) / previousMonthSpend) * 100;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Stats Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Impressions</CardDescription>
            <CardTitle className="text-3xl">{totalImpressions.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart size={14} className="mr-1" />
              <span>Across all campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Clicks</CardDescription>
            <CardTitle className="text-3xl">{totalClicks.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity size={14} className="mr-1" />
              <span>Engaged users</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average CTR</CardDescription>
            <CardTitle className="text-3xl">{avgCTR.toFixed(2)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              {avgCTR > 2 ? (
                <TrendingUp size={14} className="mr-1 text-green-500" />
              ) : (
                <TrendingDown size={14} className="mr-1 text-red-500" />
              )}
              <span>Industry avg: 2.00%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Ad Spend</CardDescription>
            <CardTitle className="text-3xl">${totalSpend.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              {spendGrowth > 0 ? (
                <TrendingUp size={14} className="mr-1 text-green-500" />
              ) : (
                <TrendingDown size={14} className="mr-1 text-red-500" />
              )}
              <span>{Math.abs(spendGrowth).toFixed(1)}% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StatsOverview;
