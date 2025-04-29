
import React from "react";
import { Card } from "@/components/ui/card";

interface RequiredCreditsBannerProps {
  requiredCredits: number;
}

const RequiredCreditsBanner: React.FC<RequiredCreditsBannerProps> = ({ requiredCredits }) => {
  return (
    <Card className="p-4 mb-6 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
      <p className="text-amber-800 dark:text-amber-200">
        You need <strong>{requiredCredits} more credits</strong> to create this campaign. 
        Please purchase more credits below.
      </p>
    </Card>
  );
};

export default RequiredCreditsBanner;
