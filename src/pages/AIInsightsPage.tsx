
import React, { useState } from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Button } from "@/components/ui/button";
import { AIOptimizationCard, AIInsightsCard } from "@/components/analytics/insights";
import { RefreshCw, PieChart, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import PerformanceAnalysis from "@/components/analytics/PerformanceAnalysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define the Campaign type directly within this component
interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  startDate: string;
  endDate?: string;
}

const AIInsightsPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // For demonstration purposes showing last optimization: 24 hours ago
  const lastOptimizationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString();
  
  // For demonstration purposes, using mock campaigns
  const campaigns: Campaign[] = [
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
  ];
  
  // Handle refresh of AI insights
  const handleRefreshInsights = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  return (
    <SafeAppLayout activePage="ai-insights">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">AI Insights & Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered analytics and optimization suggestions
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleRefreshInsights}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Insights
          </Button>
        </div>
        
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="analytics">Campaign Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIOptimizationCard />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Last AI Optimization</CardTitle>
                  <CardDescription>
                    Automatic optimizations applied to your campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                          <PieChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Budget Reallocation</p>
                          <p className="text-xs text-muted-foreground">Optimized spend across campaigns</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{lastOptimizationTime}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                          <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Ad Copy Improvement</p>
                          <p className="text-xs text-muted-foreground">Auto-generated headlines for better CTR</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{lastOptimizationTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full">
              <AIInsightsCard />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsOverview campaigns={campaigns} />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default AIInsightsPage;
