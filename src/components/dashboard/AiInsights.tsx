
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AiInsights: React.FC = () => {
  const navigate = useNavigate();
  
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
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">AI Recommendations</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => navigate("/insights")}
        >
          View All
          <ChevronRight size={16} />
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="divide-y">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{insight.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                </div>
                <div className="ml-3">
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsights;
