
import React from "react";
import { getCreditCosts } from "@/services";

const CreditCostInfo = () => {
  const creditCostsData = getCreditCosts();
  
  return (
    <div className="space-y-3 my-2">
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">Campaign Creation</p>
        <p className="text-sm text-muted-foreground">
          {creditCostsData.campaignCreation} credits per campaign
        </p>
      </div>
      
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">AI Optimization</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Daily: {creditCostsData.aiOptimization.daily} credits per cycle</p>
          <p>Every 3 Days: {creditCostsData.aiOptimization.every3Days} credits per cycle</p>
          <p>Weekly: {creditCostsData.aiOptimization.weekly} credits per cycle</p>
        </div>
      </div>
      
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">Image Generation</p>
        <p className="text-sm text-muted-foreground">
          {creditCostsData.imageGeneration} credits per image
        </p>
      </div>
    </div>
  );
};

export default CreditCostInfo;
