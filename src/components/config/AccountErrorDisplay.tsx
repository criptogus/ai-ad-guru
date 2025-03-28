
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AccountErrorDisplayProps {
  error: string | null;
  errorDetails: string | null;
  errorType: string | null;
}

const AccountErrorDisplay: React.FC<AccountErrorDisplayProps> = ({ 
  error, 
  errorDetails, 
  errorType 
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>
        {error}
        {errorDetails && (
          <div className="mt-2 text-sm">
            <details>
              <summary className="cursor-pointer font-medium">Technical Details</summary>
              <p className="mt-2 text-xs font-mono bg-destructive/10 p-2 rounded">{errorDetails}</p>
            </details>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AccountErrorDisplay;
