
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AccountErrorDisplayProps {
  error: string | null;
  errorDetails: string | null;
  errorType: string | null;
}

const AccountErrorDisplay: React.FC<AccountErrorDisplayProps> = ({
  error,
  errorDetails,
  errorType,
}) => {
  if (!error) return null;

  // Helper to render troubleshooting steps
  const renderTroubleshootingSteps = () => {
    if (errorType === "credentials") {
      return (
        <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm">
          <h4 className="font-medium mb-2">Troubleshooting Steps:</h4>
          <ol className="list-decimal ml-4 space-y-2">
            <li>Verify that all required API credentials are set in the Edge Function secrets.</li>
            <li>For Google: Make sure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_DEVELOPER_TOKEN are set.</li>
            <li>For Meta: Make sure META_CLIENT_ID and META_CLIENT_SECRET are set.</li>
            <li>Check that the redirect URIs are correctly configured in the respective API consoles.</li>
          </ol>
        </div>
      );
    } else if (errorType === "edge_function") {
      return (
        <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm">
          <h4 className="font-medium mb-2">Troubleshooting Steps:</h4>
          <ol className="list-decimal ml-4 space-y-2">
            <li>Check the Edge Function logs for detailed error messages.</li>
            <li>Verify that the Edge Function is properly deployed.</li>
            <li>Ensure all required credentials are correctly set in the Edge Function secrets.</li>
            <li>Confirm that the Edge Function has the necessary permissions.</li>
          </ol>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center">
        Connection Error
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                <HelpCircle size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">OAuth errors can occur due to misconfigured credentials, incorrect redirect URIs, or Edge Function issues.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertTitle>
      <AlertDescription>
        <p>{error}</p>
        {errorDetails && (
          <p className="mt-2 text-sm">{errorDetails}</p>
        )}
        {renderTroubleshootingSteps()}
      </AlertDescription>
    </Alert>
  );
};

export default AccountErrorDisplay;
