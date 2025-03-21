
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

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "high": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case "Google": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Meta": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Microsoft": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card className="border-amber-100 shadow-sm h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
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
              <div className="flex gap-3">
                <div className="mt-1 flex flex-col gap-2 items-center">
                  <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPlatformColor(opt.platform)}`}>
                    {opt.platform}
                  </div>
                  <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${getImpactColor(opt.impact)}`}>
                    {opt.impact}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-2">{opt.description}</p>
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                      Apply ({opt.credits} credits)
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
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
