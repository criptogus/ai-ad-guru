import React from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIOptimizationCard, AIInsightsCard } from "@/components/analytics/insights";
import { 
  optimizationData, 
  insightsData 
} from "@/components/analytics/data/mockData";

const AIInsightsPage: React.FC = () => {
  // For demonstration purposes showing last optimization: 24 hours ago
  const lastOptimizationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString();
  
  return (
    <AppLayout activePage="ai-insights">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">AI Insights</h1>
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
        
        <Card>
          <CardHeader>
            <CardTitle>AI Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed analysis of your campaign performance with AI-powered recommendations for optimization.
            </p>
            {/* Additional content can be added here */}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AIInsightsPage;
