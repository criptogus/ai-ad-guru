
import React from "react";
import { getCreditCost } from "@/services/credits/creditCosts";

const CreditCostInfo = () => {
  // Get individual credit costs
  const campaignCreation = getCreditCost("campaign_creation");
  const dailyOptimization = getCreditCost("adOptimization.daily");
  const every3DaysOptimization = getCreditCost("adOptimization.every3Days");
  const weeklyOptimization = getCreditCost("adOptimization.weekly");
  const imageGeneration = getCreditCost("imageGeneration");
  
  return (
    <div className="space-y-3 my-2">
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">Campaign Creation</p>
        <p className="text-sm text-muted-foreground">
          {campaignCreation} credits per campaign
        </p>
      </div>
      
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">AI Optimization</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Daily: {dailyOptimization} credits per cycle</p>
          <p>Every 3 Days: {every3DaysOptimization} credits per cycle</p>
          <p>Weekly: {weeklyOptimization} credits per cycle</p>
        </div>
      </div>
      
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">Image Generation</p>
        <p className="text-sm text-muted-foreground">
          {imageGeneration} credits per image
        </p>
      </div>
    </div>
  );
};

export default CreditCostInfo;
