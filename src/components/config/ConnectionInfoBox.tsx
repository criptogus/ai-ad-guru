
import React from "react";
import { AlertTriangle, LucideInfo, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConnectionInfoBoxProps {
  hasError: boolean;
}

const ConnectionInfoBox: React.FC<ConnectionInfoBoxProps> = ({ hasError }) => {
  return (
    <>
      {hasError ? (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="text-sm mt-2">
            <p>We encountered an issue connecting to the ad platform. Please try again or contact support if the issue persists.</p>
            <p className="font-medium mt-2">Troubleshooting:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Check your internet connection</li>
              <li>Ensure you're granting all required permissions</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try a different browser</li>
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-primary/5 border-primary/20 mt-6">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Google Ads API Connection</AlertTitle>
          <AlertDescription className="text-sm mt-2">
            <p>
              When connecting your Google Ads account, you'll need to grant access to manage your ads. 
              This allows our platform to create, manage, and optimize your ad campaigns.
            </p>
            <p className="mt-2">
              <strong>Requirements:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>You must have a Google Ads Manager (MCC) account</li>
              <li>Your account must have API access enabled</li>
              <li>Grant access to read/write your campaigns and ads</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Developer token is securely stored. No passwords are saved, and you can disconnect at any time.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ConnectionInfoBox;
