
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
      <AlertDescription className="mt-1">
        {error}
        {errorDetails && (
          <div className="mt-2">
            <details className="group">
              <summary className="cursor-pointer font-medium flex items-center gap-1 text-sm">
                <span className="underline-offset-4 group-hover:underline">Technical Details</span>
              </summary>
              <p className="mt-2 text-xs font-mono bg-destructive/10 p-3 rounded">{errorDetails}</p>
            </details>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AccountErrorDisplay;
