
import React, { useState } from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIOptimizationCard, AIInsightsCard } from "@/components/analytics/insights";
import { ChevronRight, RefreshCw } from "lucide-react";
import AnalyticsOverview, { Campaign } from "@/components/analytics/AnalyticsOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIInsightsPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // For demonstration purposes showing last optimization: 24 hours ago
  const lastOptimizationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString();
  
  // For demonstration purposes, using mock campaigns with the correct shape
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
    // More campaign data...
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
          </TabsList>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIOptimizationCard />
              <div className="w-full overflow-hidden">
                <AIInsightsCard />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Detailed analysis of your campaign performance with AI-powered recommendations for optimization.
                  </p>
                  <div className="h-[220px] flex items-center justify-center bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">Performance chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-between">
                    Generate New Ad Variations
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Optimize Budget Allocation
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Analyze Competitor Ads
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsOverview campaigns={campaigns} />
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default AIInsightsPage;
