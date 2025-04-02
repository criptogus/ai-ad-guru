
import React from "react";
import { CREDIT_COSTS } from "@/services/credits/creditCosts";

const CreditCostInfo: React.FC = () => {
  const creditItems = [
    { label: "Google Ads (5 variations)", action: "googleAds" },
    { label: "Meta Ads (with image)", action: "metaAds" },
    { label: "LinkedIn Ads", action: "linkedinAds" },
    { label: "Microsoft Ads", action: "microsoftAds" },
    { label: "Image Generation", action: "imageGeneration" },
    { label: "Smart Banner", action: "smartBanner" },
    { label: "Daily Optimization", action: "adOptimization.daily" },
    { label: "Weekly Optimization", action: "adOptimization.weekly" },
    { label: "Monthly Optimization", action: "adOptimization.monthly" },
  ];

  return (
    <div className="space-y-4 my-4">
      <p className="text-sm text-muted-foreground mb-2">
        Here's how credits are used for each action:
      </p>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Action
              </th>
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Credits
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {creditItems.map((item) => (
              <tr key={item.action}>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  {item.label}
                </td>
                <td className="px-4 py-2 text-sm text-right whitespace-nowrap font-medium">
                  {CREDIT_COSTS[item.action as keyof typeof CREDIT_COSTS]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Credits are automatically deducted when you perform these actions. Additional actions may have different credit costs.
      </p>
    </div>
  );
};

export default CreditCostInfo;
