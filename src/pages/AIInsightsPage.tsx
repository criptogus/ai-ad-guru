
import React from "react";
import AppLayout from "@/components/AppLayout";
import { AIInsightsCard, AIOptimizationCard } from "@/components/analytics/insights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIInsightsPage = () => {
  return (
    <AppLayout activePage="insights">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations and insights to optimize your campaigns
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AIOptimizationCard />
          <AIInsightsCard />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>AI-powered changes applied to your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Budget reallocation</span>
                </div>
                <p className="text-sm mt-2">
                  Budget was reallocated from low-performing ad "Summer Sale 2023" to high-performing ad "New Collection Launch".
                </p>
                <p className="text-xs text-muted-foreground mt-1">Applied 2 days ago</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Ad paused</span>
                </div>
                <p className="text-sm mt-2">
                  Low-performing ad "Limited Time Offer" was paused due to high cost per conversion and low CTR.
                </p>
                <p className="text-xs text-muted-foreground mt-1">Applied 3 days ago</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">New ad variation created</span>
                </div>
                <p className="text-sm mt-2">
                  New ad variation was created based on your best-performing ad "Spring Collection 2023".
                </p>
                <p className="text-xs text-muted-foreground mt-1">Applied 5 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AIInsightsPage;
