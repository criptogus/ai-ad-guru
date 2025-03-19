
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface AIInsightsCardProps {
  insights: {
    category: string;
    title: string;
    description: string;
    colorClass: string;
  }[];
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">AI Campaign Insights</CardTitle>
        <CardDescription>
          AI-powered recommendations to improve performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 ${insight.colorClass} rounded-md`}>
              <h4 className={`font-medium ${insight.category === 'creative' ? 'text-blue-800 dark:text-blue-400' : 
                              insight.category === 'audience' ? 'text-green-800 dark:text-green-400' : 
                              'text-amber-800 dark:text-amber-400'} mb-1`}>
                {insight.title}
              </h4>
              <p className={`text-sm ${insight.category === 'creative' ? 'text-blue-600 dark:text-blue-300' : 
                             insight.category === 'audience' ? 'text-green-600 dark:text-green-300' : 
                             'text-amber-600 dark:text-amber-300'}`}>
                {insight.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <Button variant="outline" className="w-full justify-between">
            View Detailed AI Analysis
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
