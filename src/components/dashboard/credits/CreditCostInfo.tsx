
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CREDIT_COSTS } from "@/services/credits/creditCosts";

const CreditCostInfo = () => {
  // Group credit costs by category
  const categorizedCosts = {
    "Ad Creation": ["googleAds", "metaAds", "linkedinAds", "microsoftAds"],
    "Image & Banner Generation": ["imageGeneration", "smartBanner"],
    "AI Optimization": ["adOptimization.daily", "adOptimization.weekly", "adOptimization.monthly"],
    "Analysis & Reports": ["campaignAnalysis", "websiteAnalysis", "exportReport"]
  };
  
  // Format action name for display
  const formatActionName = (action: string): string => {
    // Handle special formats
    if (action.includes('.')) {
      const [base, frequency] = action.split('.');
      return `${base.charAt(0).toUpperCase() + base.slice(1)} (${frequency})`;
    }
    
    // Normal formatting
    return action
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead className="text-right">Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(categorizedCosts).map(([category, actions]) => (
          <React.Fragment key={category}>
            <TableRow>
              <TableCell colSpan={2} className="font-medium bg-muted/50">
                {category}
              </TableCell>
            </TableRow>
            {actions.map((action) => (
              <TableRow key={action}>
                <TableCell>{formatActionName(action)}</TableCell>
                <TableCell className="text-right">{CREDIT_COSTS[action as keyof typeof CREDIT_COSTS]} credits</TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default CreditCostInfo;
