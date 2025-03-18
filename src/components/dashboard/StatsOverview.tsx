
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Activity, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Campaign } from "@/models/CampaignTypes";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface StatsOverviewProps {
  campaigns: Campaign[];
}

// Mock data for the chart
const chartData = [
  { name: "Jan", impressions: 2400, clicks: 400 },
  { name: "Feb", impressions: 1398, clicks: 300 },
  { name: "Mar", impressions: 9800, clicks: 1200 },
  { name: "Apr", impressions: 3908, clicks: 800 },
  { name: "May", impressions: 4800, clicks: 980 },
  { name: "Jun", impressions: 3800, clicks: 830 },
  { name: "Jul", impressions: 4300, clicks: 1100 },
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

  // Calculate month-over-month growth (mock data)
  const previousMonthSpend = totalSpend * 0.8;
  const spendGrowth = ((totalSpend - previousMonthSpend) / previousMonthSpend) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Performance Metrics</h2>
        <select className="bg-background border border-input rounded-md px-3 py-1 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Impressions"
          value={totalImpressions.toLocaleString()}
          icon={<BarChart className="h-4 w-4" />}
          description="Across all campaigns"
          color="blue"
        />

        <StatCard 
          title="Clicks"
          value={totalClicks.toLocaleString()}
          icon={<Activity className="h-4 w-4" />}
          description="Engaged users"
          color="purple"
        />

        <StatCard 
          title="CTR"
          value={`${avgCTR.toFixed(2)}%`}
          icon={avgCTR > 2 
            ? <TrendingUp className="h-4 w-4 text-green-500" /> 
            : <TrendingDown className="h-4 w-4 text-red-500" />}
          description={`Industry avg: 2.00%`}
          trend={avgCTR > 2 ? "up" : "down"}
          color="green"
        />

        <StatCard 
          title="Ad Spend"
          value={`$${totalSpend.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4" />}
          description={`${Math.abs(spendGrowth).toFixed(1)}% from last month`}
          trend={spendGrowth > 0 ? "up" : "down"}
          color="amber"
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Campaign Performance</h3>
          <div className="h-[220px]">
            <ChartContainer
              config={{
                impressions: {
                  label: "Impressions",
                  color: "#4F46E5"
                },
                clicks: {
                  label: "Clicks",
                  color: "#10B981"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    name="Impressions"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: "up" | "down";
  color?: "blue" | "purple" | "green" | "amber";
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  color = "blue" 
}) => {
  const getGradient = () => {
    switch (color) {
      case "blue": return "from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent";
      case "purple": return "from-purple-50 to-transparent dark:from-purple-950/30 dark:to-transparent";
      case "green": return "from-green-50 to-transparent dark:from-green-950/30 dark:to-transparent";
      case "amber": return "from-amber-50 to-transparent dark:from-amber-950/30 dark:to-transparent";
      default: return "from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent";
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case "blue": return "border-blue-100 dark:border-blue-800/30";
      case "purple": return "border-purple-100 dark:border-purple-800/30";
      case "green": return "border-green-100 dark:border-green-800/30";
      case "amber": return "border-amber-100 dark:border-amber-800/30";
      default: return "border-blue-100 dark:border-blue-800/30";
    }
  };

  return (
    <Card className={`overflow-hidden border ${getBorderColor()}`}>
      <div className={`bg-gradient-to-b ${getGradient()} h-full p-5`}>
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center text-xs">
          {trend && (
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
              {trend === "up" ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <TrendingDown className="inline h-3 w-3 mr-1" />}
            </span>
          )}
          <span className="text-muted-foreground">{description}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatsOverview;
