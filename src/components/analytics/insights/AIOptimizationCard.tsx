
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

// Custom icon for budget
const BudgetIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
);

const AIOptimizationCard: React.FC<AIOptimizationCardProps> = ({
  lastOptimizationTime,
  topPerformers,
  lowPerformers,
  budgetReallocations
}) => {
  return (
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
            {topPerformers.map(campaign => (
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
            {lowPerformers.map(campaign => (
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
            <BudgetIcon className="h-4 w-4 mr-1 text-blue-500" /> 
            Budget Reallocation
          </h4>
          <div className="space-y-3">
            {budgetReallocations.map(campaign => (
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
  );
};

export default AIOptimizationCard;
