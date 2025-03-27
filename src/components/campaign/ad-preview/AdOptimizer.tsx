
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Sparkles, Rocket } from "lucide-react";
import { useAdOptimizer } from "@/hooks/useAdOptimizer";
import { type OptimizationGoal } from "@/hooks/useAdOptimizer";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCreditCosts } from "@/services/credits/creditCosts";

interface AdOptimizerProps {
  adType: "google" | "meta" | "linkedin" | "microsoft";
  ads: GoogleAd[] | MetaAd[];
  onOptimizedAdsGenerated: (optimizedAds: any[]) => void;
  credits?: number;
}

const AdOptimizer: React.FC<AdOptimizerProps> = ({
  adType,
  ads,
  onOptimizedAdsGenerated,
  credits = 0
}) => {
  const [selectedGoal, setSelectedGoal] = useState<OptimizationGoal>("increase_ctr");
  const { optimizeGoogleAds, optimizeMetaAds, isOptimizing } = useAdOptimizer();
  const creditCostsData = getCreditCosts();
  const optimizationCost = creditCostsData.aiOptimization.daily;
  
  const handleOptimize = async () => {
    let optimizedAds;
    
    if (adType === "google") {
      optimizedAds = await optimizeGoogleAds(ads as GoogleAd[], undefined, selectedGoal);
    } else if (adType === "meta" || adType === "linkedin") {
      optimizedAds = await optimizeMetaAds(ads as MetaAd[], undefined, selectedGoal);
    }
    
    if (optimizedAds) {
      onOptimizedAdsGenerated(optimizedAds);
    }
  };
  
  const getGoalDescription = (goal: OptimizationGoal) => {
    switch (goal) {
      case "increase_ctr":
        return "Focuses on getting more clicks through improved headlines and descriptions";
      case "increase_conversions":
        return "Optimizes ad copy to drive more conversion actions";
      case "reduce_cpa":
        return "Aims to reduce your cost per acquisition through effective messaging";
      case "increase_engagement":
        return "Creates more engaging copy to boost interaction with your ads";
      default:
        return "";
    }
  };
  
  const hasEnoughCredits = credits >= optimizationCost;

  return (
    <Card className="border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-blue-500" />
            AI Ad Optimizer
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Costs {optimizationCost} credits
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-4">
          Let AI suggest improved ad variations based on best practices.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Optimization Goal</label>
            <Select 
              value={selectedGoal} 
              onValueChange={(value) => setSelectedGoal(value as OptimizationGoal)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select optimization goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase_ctr">Increase Click-through Rate</SelectItem>
                <SelectItem value="increase_conversions">Increase Conversions</SelectItem>
                <SelectItem value="reduce_cpa">Reduce Cost per Acquisition</SelectItem>
                <SelectItem value="increase_engagement">Increase Engagement</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {getGoalDescription(selectedGoal)}
            </p>
          </div>
          
          {!hasEnoughCredits && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-800 dark:text-red-300">
              You need {optimizationCost} credits to use the optimizer.
              Please purchase more credits to continue.
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-3">
        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing || !hasEnoughCredits || ads.length === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 space-x-2"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Create Optimized Variations</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdOptimizer;
