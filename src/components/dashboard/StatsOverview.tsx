
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";

interface StatsOverviewProps {
  campaigns: Campaign[];
}

// Simple, clean mock data for the chart
const chartData = [
  { name: "Mon", impressions: 2400, clicks: 400 },
  { name: "Tue", impressions: 1398, clicks: 300 },
  { name: "Wed", impressions: 9800, clicks: 1200 },
  { name: "Thu", impressions: 3908, clicks: 800 },
  { name: "Fri", impressions: 4800, clicks: 980 },
  { name: "Sat", impressions: 3800, clicks: 830 },
  { name: "Sun", impressions: 4300, clicks: 1100 },
];

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Impressions"
          value={totalImpressions.toLocaleString()}
          description="Total views"
        />

        <StatCard 
          title="Clicks"
          value={totalClicks.toLocaleString()}
          description="User interactions"
        />

        <StatCard 
          title="CTR"
          value={`${avgCTR.toFixed(2)}%`}
          description="Click-through rate"
        />

        <StatCard 
          title="Ad Spend"
          value={`$${totalSpend.toFixed(2)}`}
          description="Total budget used"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Weekly Performance</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip />
                <Bar dataKey="clicks" name="Clicks" fill="#4285F4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="impressions" name="Impressions" fill="#34A853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <div className="text-2xl font-medium mb-1">{value}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};

export default StatsOverview;
