
import React from "react";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const CreditSystemAlert: React.FC = () => {
  const { user } = useAuth();
  const isLowCredits = (user?.credits || 0) < 20;
  
  if (isLowCredits) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Low Credit Balance</AlertTitle>
        <AlertDescription>
          Your credit balance is getting low. Purchase more credits to continue using all platform features.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Credit-Based System</AlertTitle>
      <AlertDescription>
        Our platform uses credits to power AI features like ad creation and optimization.
        Each action costs a specific number of credits depending on the computational resources required.
      </AlertDescription>
    </Alert>
  );
};

export default CreditSystemAlert;
