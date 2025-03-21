
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Lightbulb, Zap, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsCardProps {
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  isLoading = false,
  onRefresh
}) => {
  // In a real app, these would be fetched from an API
  const insights = [
    {
      id: 1,
      type: "critical",
      message: "Your 'Summer Collection' campaign CTR has dropped by 20% in the last 3 days. Consider updating your image or headline to improve engagement.",
      action: "Edit Ad"
    },
    {
      id: 2,
      type: "opportunity",
      message: "Users from mobile devices convert 40% better than desktop for your 'Product Launch' campaign. Consider increasing mobile ad spend by 15%.",
      action: "Adjust Budget"
    },
    {
      id: 3,
      type: "insight",
      message: "Your Google ads perform better on weekdays while Instagram ads show higher engagement on weekends. Consider adjusting your scheduling strategy.",
      action: "View Schedule"
    }
  ];

  const getInsightStyles = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case "opportunity":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20";
      case "insight":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 9v4"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="10"></circle></svg>;
      case "opportunity":
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case "insight":
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Zap className="h-5 w-5 mr-2 text-amber-500" /> 
            AI Performance Insights
          </CardTitle>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh insights</span>
            </Button>
          )}
        </div>
        <CardDescription>
          AI-powered recommendations to optimize your campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Actual insights
          <div className="space-y-3">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border ${getInsightStyles(insight.type)}`}
              >
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{insight.message}</p>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 font-medium text-xs flex items-center gap-1"
                    >
                      {insight.action}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
