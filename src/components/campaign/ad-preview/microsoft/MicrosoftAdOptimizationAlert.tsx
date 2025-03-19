
import React from "react";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MicrosoftAdOptimizationAlert = () => {
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
      <AlertDescription className="text-blue-700 text-sm">
        Microsoft ads are automatically optimized for Bing search results, focusing on Microsoft ecosystem users and Edge browser compatibility.
      </AlertDescription>
    </Alert>
  );
};

export default MicrosoftAdOptimizationAlert;
