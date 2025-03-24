
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AiInsights: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock AI insights
  const insights = [
    {
      id: 1,
      title: "Increase your CTR by 23%",
      description: "Adding customer testimonials to your ad description can boost engagement.",
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      impact: "high",
      platform: "google"
    },
    {
      id: 2,
      title: "Optimize your ad spend",
      description: "Reallocate 20% of your budget from campaign 'Summer Sale' to 'New Products'.",
      icon: <Lightbulb className="h-4 w-4 text-primary" />,
      impact: "medium",
      platform: "meta"
    },
    {
      id: 3,
      title: "Try new headline format",
      description: "A/B test question-based headlines for your Google search campaigns.",
      icon: <Zap className="h-4 w-4 text-primary" />,
      impact: "low",
      platform: "google"
    }
  ];

  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case "high":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">High impact</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">Medium impact</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900">Low impact</Badge>;
      default:
        return null;
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch(platform) {
      case "google":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">Google</Badge>;
      case "meta":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900">Meta</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
        <CardDescription>Smart suggestions to improve your campaigns</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {insight.icon}
                  </div>
                </div>
                <div className="flex-grow space-y-1">
                  <h3 className="text-sm font-medium">{insight.title}</h3>
                  <div className="flex gap-2 mb-2">
                    {getPlatformBadge(insight.platform)}
                    {getImpactBadge(insight.impact)}
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-8">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-primary"
          onClick={() => navigate("/insights")}
        >
          View All Insights
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiInsights;
