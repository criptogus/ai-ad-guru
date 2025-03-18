
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GoogleAdOptimizationAlert: React.FC = () => {
  return (
    <Alert className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        This ad will be automatically optimized based on campaign performance.
      </AlertDescription>
    </Alert>
  );
};

export default GoogleAdOptimizationAlert;
