
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, TrendingUp, Zap } from "lucide-react";

interface AIInsightsCardProps {
  insights: {
    category: string;
    title: string;
    description: string;
    colorClass: string;
  }[];
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'creative': return <Lightbulb className="h-4 w-4" />;
      case 'audience': return <TrendingUp className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">AI Campaign Insights</CardTitle>
        <CardDescription>
          AI-powered recommendations to improve performance
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {getCategoryIcon(insight.category)}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">{insight.description}</p>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 text-center border-t">
          <Button variant="ghost" size="sm" className="text-xs text-blue-600">
            View All Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
