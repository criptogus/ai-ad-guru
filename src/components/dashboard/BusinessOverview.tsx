
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, CreditCard, PieChart, Users, Megaphone } from "lucide-react";

interface BusinessOverviewProps {
  campaigns: Campaign[];
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({ campaigns }) => {
  // Calculate total metrics
  const totalSpend = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.spend || 0), 0);
  
  const totalConversions = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.conversions || 0), 0);
  
  const totalImpressions = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.impressions || 0), 0);
    
  const avgCTR = totalImpressions > 0 
    ? (campaigns.reduce((total, campaign) => 
        total + (campaign.performance?.clicks || 0), 0) / totalImpressions) * 100 
    : 0;
  
  // Sample data for sparklines
  const spendData = [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 380 },
    { name: "Wed", value: 450 },
    { name: "Thu", value: 470 },
    { name: "Fri", value: 520 },
    { name: "Sat", value: 490 },
    { name: "Sun", value: 510 },
  ];
  
  const ctrData = [
    { name: "Mon", value: 3.2 },
    { name: "Tue", value: 3.1 },
    { name: "Wed", value: 3.3 },
    { name: "Thu", value: 3.5 },
    { name: "Fri", value: 3.4 },
    { name: "Sat", value: 3.6 },
    { name: "Sun", value: 3.8 },
  ];
  
  const conversionData = [
    { name: "Mon", value: 25 },
    { name: "Tue", value: 20 },
    { name: "Wed", value: 28 },
    { name: "Thu", value: 30 },
    { name: "Fri", value: 32 },
    { name: "Sat", value: 28 },
    { name: "Sun", value: 35 },
  ];
  
  const roiData = [
    { name: "Mon", value: 110 },
    { name: "Tue", value: 105 },
    { name: "Wed", value: 115 },
    { name: "Thu", value: 118 },
    { name: "Fri", value: 120 },
    { name: "Sat", value: 125 },
    { name: "Sun", value: 130 },
  ];

  // Find top performing channel
  const channelPerformance = {
    google: { conversions: 0, spend: 0 },
    meta: { conversions: 0, spend: 0 },
  };

  campaigns.forEach(campaign => {
    const platform = campaign.platform.toLowerCase();
    if (platform === 'google' || platform === 'meta') {
      channelPerformance[platform].conversions += campaign.performance?.conversions || 0;
      channelPerformance[platform].spend += campaign.performance?.spend || 0;
    }
  });

  const getTopChannel = () => {
    if (channelPerformance.google.conversions === 0 && channelPerformance.meta.conversions === 0) {
      return 'No data';
    }
    
    const googleCPA = channelPerformance.google.spend / (channelPerformance.google.conversions || 1);
    const metaCPA = channelPerformance.meta.spend / (channelPerformance.meta.conversions || 1);
    
    return googleCPA < metaCPA ? 'Google' : 'Meta';
  };

  const topChannel = getTopChannel();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <BusinessMetricCard
        title="Total Ad Spend"
        value={`$${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        trend="up"
        percentage={12}
        icon={<CreditCard className="h-4 w-4 text-blue-500" />}
        chartData={spendData}
        chartColor="#4285F4"
      />
      
      <BusinessMetricCard
        title="Avg CTR"
        value={`${avgCTR.toFixed(2)}%`}
        trend="up"
        percentage={5.2}
        icon={<PieChart className="h-4 w-4 text-green-500" />}
        chartData={ctrData}
        chartColor="#34A853"
      />
      
      <BusinessMetricCard
        title="Conversions"
        value={totalConversions.toString()}
        trend="up"
        percentage={8.1}
        icon={<Users className="h-4 w-4 text-purple-500" />}
        chartData={conversionData}
        chartColor="#8A4ED2"
      />
      
      <BusinessMetricCard
        title="Top Channel"
        value={topChannel}
        trend="neutral"
        percentage={0}
        icon={<Megaphone className="h-4 w-4 text-amber-500" />}
        chartData={roiData}
        chartColor="#FBBC04"
        valueSize="text-lg"
      />
    </div>
  );
};

interface BusinessMetricCardProps {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  percentage: number;
  icon: React.ReactNode;
  chartData: { name: string; value: number }[];
  chartColor: string;
  valueSize?: string;
}

const BusinessMetricCard: React.FC<BusinessMetricCardProps> = ({
  title,
  value,
  trend,
  percentage,
  icon,
  chartData,
  chartColor,
  valueSize = "text-2xl"
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="bg-primary/10 p-1.5 rounded-full">{icon}</div>
        </div>
        
        <div className="space-y-2">
          <div className={`font-semibold ${valueSize}`}>{value}</div>
          
          <div className="flex items-center gap-1 text-xs">
            {trend === "up" && (
              <>
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{percentage}%</span>
              </>
            )}
            
            {trend === "down" && (
              <>
                <ArrowDownRight className="h-3 w-3 text-red-600" />
                <span className="text-red-600">{percentage}%</span>
              </>
            )}
            
            <span className="text-muted-foreground">vs previous week</span>
          </div>
        </div>
        
        <div className="h-[40px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded shadow-sm py-1 px-2 text-xs">
                        <p>{`${payload[0].payload.name}: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOverview;
