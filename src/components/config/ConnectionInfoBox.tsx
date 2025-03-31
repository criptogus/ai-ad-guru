
import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
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
              When connecting your Google Ads account, you'll need to grant access to <strong>manage your Google Ads campaigns</strong>. 
              This is different from a regular Google login and requires specific Google Ads permissions.
            </p>
            <p className="mt-2">
              <strong>Requirements:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>You must have a Google Ads account</li>
              <li>You need to grant <strong>access to your Google Ads data</strong> (not just your Google profile)</li>
              <li>Your account must have API access enabled</li>
              <li>If you see only Google profile permissions, please contact support</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Your credentials are securely stored. No passwords are saved, and you can disconnect at any time.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ConnectionInfoBox;
