
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Award, AlertCircle, ChevronRight, Zap } from "lucide-react";

interface OptimizationPerformer {
  id: string;
  name: string;
  platform: string;
  ctr: number;
  conversionRate: number;
}

interface BudgetReallocation {
  id: string;
  name: string;
  platform: string;
  currentBudget: number;
  recommendedBudget: number;
}

interface AIOptimizationCardProps {
  lastOptimizationTime: string;
  topPerformers: OptimizationPerformer[];
  lowPerformers: OptimizationPerformer[];
  budgetReallocations: BudgetReallocation[];
}

const AIOptimizationCard: React.FC<AIOptimizationCardProps> = ({
  lastOptimizationTime,
  topPerformers,
  lowPerformers,
  budgetReallocations
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" /> 
            AI Optimization
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Updated {lastOptimizationTime}
          </Badge>
        </div>
        <CardDescription>AI-powered campaign performance insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Performers */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium flex items-center mb-3">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" /> 
            Top Performing Campaigns
          </h4>
          <div className="space-y-3">
            {topPerformers.map(campaign => (
              <div key={campaign.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm">{campaign.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {campaign.platform === "google" ? "Google" : "Meta"}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  CTR: {campaign.ctr}% • CR: {campaign.conversionRate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Performers */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium flex items-center mb-3">
            <TrendingDown className="h-4 w-4 mr-2 text-red-600" /> 
            Paused Campaigns
          </h4>
          <div className="space-y-3">
            {lowPerformers.map(campaign => (
              <div key={campaign.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm">{campaign.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {campaign.platform === "google" ? "Google" : "Meta"}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full">
                  CTR: {campaign.ctr}% • CR: {campaign.conversionRate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Recommendations */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium flex items-center mb-3">
            <svg
              className="h-4 w-4 mr-2 text-blue-600"
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
            Budget Reallocation
          </h4>
          <div className="space-y-4">
            {budgetReallocations.map(campaign => (
              <div key={campaign.id} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{campaign.name}</span>
                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {campaign.platform === "google" ? "Google" : "Meta"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-xs font-medium min-w-16">
                    ${campaign.currentBudget}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={campaign.recommendedBudget / (campaign.currentBudget > campaign.recommendedBudget ? campaign.currentBudget : campaign.recommendedBudget) * 100}
                      className={`h-2 ${campaign.recommendedBudget > campaign.currentBudget ? "bg-green-600" : "bg-red-600"}`}
                    />
                  </div>
                  <div className="text-xs font-medium min-w-16 text-right">
                    ${campaign.recommendedBudget}
                  </div>
                </div>
                <div className="mt-1 text-xs text-right">
                  <span className={campaign.recommendedBudget > campaign.currentBudget ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {campaign.recommendedBudget > campaign.currentBudget 
                      ? `+$${campaign.recommendedBudget - campaign.currentBudget}` 
                      : `-$${campaign.currentBudget - campaign.recommendedBudget}`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <Button className="w-full justify-between bg-blue-600 hover:bg-blue-700">
            Apply AI Recommendations
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIOptimizationCard;
