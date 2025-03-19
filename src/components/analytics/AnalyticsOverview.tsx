
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/models/CampaignTypes";
import {
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { ChevronRight, TrendingUp, TrendingDown, Zap, Award, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AnalyticsOverviewProps {
  campaigns: Campaign[];
}

// Sample AI optimization data
const optimizationData = {
  topPerformers: [
    { id: "1", name: "Summer Sale", platform: "google", ctr: 4.2, conversionRate: 2.1 },
    { id: "2", name: "Brand Awareness", platform: "meta", ctr: 3.8, conversionRate: 1.9 },
    { id: "3", name: "Product Launch", platform: "google", ctr: 3.5, conversionRate: 1.7 }
  ],
  lowPerformers: [
    { id: "4", name: "Holiday Special", platform: "meta", ctr: 0.8, conversionRate: 0.3 },
    { id: "5", name: "Clearance Sale", platform: "google", ctr: 0.7, conversionRate: 0.4 }
  ],
  budgetReallocation: [
    { id: "1", name: "Summer Sale", platform: "google", currentBudget: 500, recommendedBudget: 750 },
    { id: "4", name: "Holiday Special", platform: "meta", currentBudget: 400, recommendedBudget: 200 }
  ]
};

// Sample performance data
const performanceData = [
  { date: "Jul 01", impressions: 12000, clicks: 320, ctr: 2.67, conversions: 28 },
  { date: "Jul 02", impressions: 13500, clicks: 380, ctr: 2.81, conversions: 32 },
  { date: "Jul 03", impressions: 14200, clicks: 410, ctr: 2.89, conversions: 35 },
  { date: "Jul 04", impressions: 15800, clicks: 460, ctr: 2.91, conversions: 40 },
  { date: "Jul 05", impressions: 16500, clicks: 490, ctr: 2.97, conversions: 43 },
  { date: "Jul 06", impressions: 17200, clicks: 510, ctr: 2.96, conversions: 45 },
  { date: "Jul 07", impressions: 18100, clicks: 550, ctr: 3.04, conversions: 48 }
];

// Sample platform comparison data
const platformComparisonData = [
  { platform: "Google", impressions: 85000, clicks: 2500, ctr: 2.94, conversions: 210, cost: 3200 },
  { platform: "Meta", impressions: 92000, clicks: 2800, ctr: 3.04, conversions: 240, cost: 3500 }
];

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ campaigns }) => {
  // Calculate overall metrics from campaigns
  const totalImpressions = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.impressions || 0), 0);
  
  const totalClicks = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.clicks || 0), 0);
  
  const avgCTR = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;
  
  const totalSpend = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.spend || 0), 0);

  // For demonstration purposes showing last optimization: 24 hours ago
  const lastOptimizationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
              <CardDescription>Last 7 days of campaign data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="clicks"
                      name="Clicks"
                      stroke="#4285F4"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="conversions"
                      name="Conversions"
                      stroke="#34A853"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ctr"
                      name="CTR (%)"
                      stroke="#FBBC05"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Platform Comparison</CardTitle>
              <CardDescription>Google Ads vs Meta Ads performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={platformComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impressions" name="Impressions" fill="#4285F4" />
                    <Bar dataKey="clicks" name="Clicks" fill="#34A853" />
                    <Bar dataKey="conversions" name="Conversions" fill="#EA4335" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Optimization Summary */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" /> 
                  AI Optimization
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Automated
                </Badge>
              </div>
              <CardDescription>Last optimization ran: {lastOptimizationTime}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Top Performers */}
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" /> 
                  Top Performing Campaigns
                </h4>
                <div className="space-y-2">
                  {optimizationData.topPerformers.map(campaign => (
                    <div key={campaign.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{campaign.name}</span>
                        <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-800">
                          {campaign.platform === "google" ? "Google" : "Meta"}
                        </Badge>
                      </div>
                      <div className="font-medium">
                        CTR: {campaign.ctr}% • CR: {campaign.conversionRate}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Low Performers */}
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <TrendingDown className="h-4 w-4 mr-1 text-red-500" /> 
                  Paused Campaigns
                </h4>
                <div className="space-y-2">
                  {optimizationData.lowPerformers.map(campaign => (
                    <div key={campaign.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        <span>{campaign.name}</span>
                        <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-800">
                          {campaign.platform === "google" ? "Google" : "Meta"}
                        </Badge>
                      </div>
                      <div className="font-medium text-red-500">
                        CTR: {campaign.ctr}% • CR: {campaign.conversionRate}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Budget Recommendations */}
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <Icons.budget className="h-4 w-4 mr-1 text-blue-500" /> 
                  Budget Reallocation
                </h4>
                <div className="space-y-3">
                  {optimizationData.budgetReallocation.map(campaign => (
                    <div key={campaign.id} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span>{campaign.name}</span>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          {campaign.platform === "google" ? "Google" : "Meta"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">
                          ${campaign.currentBudget} → ${campaign.recommendedBudget}
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={campaign.recommendedBudget / (campaign.currentBudget > campaign.recommendedBudget ? campaign.currentBudget : campaign.recommendedBudget) * 100}
                            className={campaign.recommendedBudget > campaign.currentBudget ? "bg-green-600" : "bg-red-600"}
                          />
                        </div>
                        <div className="text-xs font-medium">
                          {campaign.recommendedBudget > campaign.currentBudget ? `+${campaign.recommendedBudget - campaign.currentBudget}` : `-${campaign.currentBudget - campaign.recommendedBudget}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full justify-between">
                  Apply AI Recommendations
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">AI Campaign Insights</CardTitle>
              <CardDescription>
                AI-powered recommendations to improve performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">Ad Creative Insight</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Top performing ads mention "Limited Time" and show clear product images. Consider updating ad creatives to emphasize urgency and product visibility.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md dark:bg-green-900/20">
                  <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">Audience Targeting Insight</h4>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    The 25-34 age demographic has 42% higher conversion rates. Consider reallocating budget to campaigns targeting this audience segment.
                  </p>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-md dark:bg-amber-900/20">
                  <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">Budget Optimization</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Weekend campaigns show 28% higher CTR. Recommend shifting 30% of weekday budget to weekend campaigns for improved performance.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full justify-between">
                  View Detailed AI Analysis
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Icons object for custom icons used in the component
const Icons = {
  budget: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 9.5c.5-1 2-1.5 3-1a2 2 0 0 1 1 2.5c-.5 1-2 1.5-3 1a2 2 0 0 1-1-2.5" />
      <path d="M10 14c.5-1 2-1.5 3-1a2 2 0 0 1 1 2.5c-.5 1-2 1.5-3 1a2 2 0 0 1-1-2.5" />
    </svg>
  ),
};

export default AnalyticsOverview;
