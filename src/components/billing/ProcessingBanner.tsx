
import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ProcessingBanner: React.FC = () => {
  return (
    <Card className="p-4 mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-700 dark:text-blue-300" />
        <p className="text-blue-800 dark:text-blue-200">
          Processing your recent credit activity. This will be reflected in your account shortly.
        </p>
      </div>
    </Card>
  );
};

export default ProcessingBanner;
