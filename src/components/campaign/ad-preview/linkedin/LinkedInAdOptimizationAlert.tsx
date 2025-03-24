
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedInAdOptimizationAlertProps {
  score?: number;
  status?: "optimized" | "needs-optimization" | "in-progress";
  onOptimize?: () => void;
}

const LinkedInAdOptimizationAlert: React.FC<LinkedInAdOptimizationAlertProps> = ({
  score = 0,
  status = "needs-optimization",
  onOptimize
}) => {
  if (status === "optimized") {
    return (
      <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-400 ml-2">Optimized Ad</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400 ml-6">
          This LinkedIn ad is well-optimized with a score of {score}/100. The ad should perform well based on platform best practices.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === "in-progress") {
    return (
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
        <AlertTitle className="text-blue-800 dark:text-blue-400 ml-2">Optimizing Ad</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400 ml-6">
          Our AI is optimizing your LinkedIn ad to improve performance. This will take just a moment...
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
      <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-400 ml-2">Optimization Opportunity</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400 ml-6 flex items-center justify-between">
        <span>
          This LinkedIn ad scores {score}/100 and could be improved for better performance.
        </span>
        <Button 
          size="sm" 
          onClick={onOptimize}
          className="ml-2 bg-amber-600 hover:bg-amber-700 text-white"
        >
          Optimize
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LinkedInAdOptimizationAlert;
