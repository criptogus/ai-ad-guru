
import React from "react";
import { AlertTriangle } from "lucide-react";

interface AccountStatusAlertProps {
  isLowCredits: boolean;
  hasPaid?: boolean;
}

const AccountStatusAlert: React.FC<AccountStatusAlertProps> = ({ isLowCredits, hasPaid }) => {
  if (isLowCredits) {
    return (
      <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
        <span className="text-sm text-amber-700 dark:text-amber-400">
          Credits running low. Consider purchasing more.
        </span>
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="flex items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-sm text-green-700 dark:text-green-400">Premium account active</span>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground mb-2">Upgrade to premium for unlimited campaigns</p>
    </div>
  );
};

export default AccountStatusAlert;
