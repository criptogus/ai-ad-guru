
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RocketIcon } from "lucide-react";

interface AccountStatusAlertProps {
  isLowCredits: boolean;
  hasPaid?: boolean;
}

const AccountStatusAlert: React.FC<AccountStatusAlertProps> = ({ isLowCredits, hasPaid }) => {
  if (isLowCredits) {
    return (
      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
        <RocketIcon className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Low Credits</AlertTitle>
        <AlertDescription className="text-amber-700">
          You're running low on credits. Purchase more to continue using all features.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="bg-blue-50 text-blue-800 border-blue-200">
      <RocketIcon className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Account Status</AlertTitle>
      <AlertDescription className="text-blue-700">
        {hasPaid 
          ? "Your account is active with sufficient credits."
          : "You're using the free plan. Upgrade for more features."
        }
      </AlertDescription>
    </Alert>
  );
};

export default AccountStatusAlert;
