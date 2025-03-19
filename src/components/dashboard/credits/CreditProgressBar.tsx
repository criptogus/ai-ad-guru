
import React from "react";
import { Progress } from "@/components/ui/progress";

interface CreditProgressBarProps {
  currentCredits: number;
  totalCredits: number;
  isLowCredits: boolean;
}

const CreditProgressBar: React.FC<CreditProgressBarProps> = ({ 
  currentCredits, 
  totalCredits, 
  isLowCredits 
}) => {
  const usedPercentage = currentCredits > 0 ? (currentCredits / totalCredits) * 100 : 0;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <div className="text-3xl font-medium">{currentCredits}</div>
        <div className="text-sm text-muted-foreground">of {totalCredits}</div>
      </div>
      <Progress 
        value={usedPercentage} 
        className="h-2 dark:bg-gray-700" 
        indicatorClassName={isLowCredits ? "bg-amber-500" : "bg-blue-600 dark:bg-blue-500"}
      />
    </div>
  );
};

export default CreditProgressBar;
