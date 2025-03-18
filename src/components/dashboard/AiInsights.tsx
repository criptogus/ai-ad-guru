
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Lightbulb, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const AiInsights: React.FC = () => {
  // Mock AI insights
  const insights = [
    {
      id: 1,
      type: "performance",
      title: "Increase your CTR by 23%",
      description: "Adding customer testimonials to your ad description can boost engagement.",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
    {
      id: 2,
      type: "budget",
      title: "Optimize your ad spend",
      description: "Reallocate 20% of your budget from campaign 'Summer Sale' to 'New Products'.",
      icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
    },
    {
      id: 3,
      type: "creative",
      title: "Try new headline format",
      description: "A/B test question-based headlines for your Google search campaigns.",
      icon: <Zap className="h-4 w-4 text-purple-500" />,
    }
  ];

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
        <h2 className="font-bold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Insights
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Personalized recommendations to improve your campaigns</p>
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
                  <h3 className="font-medium text-sm">{insight.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">{insight.description}</p>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 text-center border-t">
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            View All Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsights;
