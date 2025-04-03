
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
  // Calculate percentage of credits used
  const percentage = (currentCredits / totalCredits) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-3xl font-bold text-gray-800">{currentCredits}</span>
        <span className="text-gray-500 self-end">of {totalCredits}</span>
      </div>
      
      <Progress 
        value={percentage} 
        className={`h-2 ${isLowCredits ? 'bg-gray-100' : 'bg-gray-100'}`}
        indicatorClassName={isLowCredits ? 'bg-amber-500' : 'bg-blue-500'} 
      />
    </div>
  );
};

export default CreditProgressBar;
