
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface PendingPurchaseBannerProps {
  onVerify: () => void;
}

const PendingPurchaseBanner: React.FC<PendingPurchaseBannerProps> = ({ onVerify }) => {
  return (
    <Card className="p-4 mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <p className="text-blue-800 dark:text-blue-200">
          You have a pending credit purchase. Click the button to verify and add credits to your account.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-4 bg-white dark:bg-gray-700" 
          onClick={onVerify}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Verify Purchase
        </Button>
      </div>
    </Card>
  );
};

export default PendingPurchaseBanner;
