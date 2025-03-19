
import React from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIOptimizationCard, AIInsightsCard } from "@/components/analytics/insights";
import { optimizationData, insightsData } from "@/components/analytics/data/mockData";
import { ChevronRight } from "lucide-react";

const AIInsightsPage: React.FC = () => {
  // For demonstration purposes showing last optimization: 24 hours ago
  const lastOptimizationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString();
  
  return (
    <AppLayout activePage="ai-insights">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">AI Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered analytics and optimization suggestions
            </p>
          </div>
          
          <Button variant="outline" size="sm" className="gap-1">
            View All Insights
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AIOptimizationCard 
            lastOptimizationTime={lastOptimizationTime}
            topPerformers={optimizationData.topPerformers}
            lowPerformers={optimizationData.lowPerformers}
            budgetReallocations={optimizationData.budgetReallocation}
          />
          
          <AIInsightsCard insights={insightsData} />
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
      </div>
    </AppLayout>
  );
};

export default AIInsightsPage;
