
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NoAdsMessage: React.FC = () => {
  return (
    <Alert className="bg-amber-50 text-amber-800 border-amber-200">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No ads have been generated yet. Please click the "Generate Ads" button to create Instagram ads.
      </AlertDescription>
    </Alert>
  );
};

export default NoAdsMessage;
