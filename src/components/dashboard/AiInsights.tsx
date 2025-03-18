
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const AiInsights: React.FC = () => {
  // Mock AI insights
  const insights = [
    {
      id: 1,
      title: "Increase your CTR by 23%",
      description: "Adding customer testimonials to your ad description can boost engagement.",
      icon: <TrendingUp className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 2,
      title: "Optimize your ad spend",
      description: "Reallocate 20% of your budget from campaign 'Summer Sale' to 'New Products'.",
      icon: <Lightbulb className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 3,
      title: "Try new headline format",
      description: "A/B test question-based headlines for your Google search campaigns.",
      icon: <Zap className="h-4 w-4 text-blue-600" />,
    }
  ];

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="font-medium">AI Recommendations</h3>
      </div>
      <CardContent className="p-0">
        <div className="divide-y">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {insight.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{insight.title}</h3>
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
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsights;
