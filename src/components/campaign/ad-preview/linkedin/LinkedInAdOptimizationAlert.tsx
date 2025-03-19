
import React from "react";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LinkedInAdOptimizationAlert = () => {
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-700 mr-2" />
      <AlertDescription className="text-blue-700 text-sm">
        LinkedIn ads are optimized for professional audiences with B2B targeting options and business-focused messaging.
      </AlertDescription>
    </Alert>
  );
};

export default LinkedInAdOptimizationAlert;
