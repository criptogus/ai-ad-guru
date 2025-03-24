
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIOptimizationCardProps {
  campaign?: any;
}

const AIOptimizationCard: React.FC<AIOptimizationCardProps> = ({ campaign }) => {
  const navigate = useNavigate();
  
  // Sample optimization opportunities (in production would come from API)
  const optimizations = [
    {
      id: 1,
      platform: "Google",
      description: "Your Google search ad for 'Business Solutions' has a 4.2% CTR, which is 18% below average for your industry. We suggest updating headlines to be more specific.",
      impact: "high",
      type: "ad_copy",
      credits: 10
    },
    {
      id: 2,
      platform: "Meta",
      description: "Your Meta ad for 'Summer Collection' dropped 21% in CTR over the last 3 days. Try updating the image with a more vibrant summer scene.",
      impact: "critical",
      type: "image",
      credits: 5
    },
    {
      id: 3,
      platform: "Google",
      description: "Budget allocation analysis suggests shifting 15% from 'Brand Awareness' to 'Product Catalog' campaign to maximize ROI.",
      impact: "medium",
      type: "budget",
      credits: 2
    }
  ];

  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case "critical":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900">Critical</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch(platform) {
      case "Google":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">Google</Badge>;
      case "Meta":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900">Meta</Badge>;
      case "Microsoft":
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-900">Microsoft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>AI Optimization</span>
          </CardTitle>
          <span className="text-xs text-muted-foreground">Updated 2h ago</span>
        </div>
        <CardDescription>
          AI-powered suggestions to improve your campaign performance
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {optimizations.map((opt) => (
            <div key={opt.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 flex flex-col gap-2 items-center">
                  {getPlatformBadge(opt.platform)}
                  {getImpactBadge(opt.impact)}
                </div>
                <div className="flex-grow space-y-2">
                  <p className="text-sm text-foreground">{opt.description}</p>
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      Apply ({opt.credits} credits)
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-8">
                      Details <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" className="w-full" onClick={() => navigate("/insights")}>
          View All Optimizations <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIOptimizationCard;
