
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionFeedbackProps {
  status: "success" | "error" | "warning" | null;
  platform: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ConnectionFeedback: React.FC<ConnectionFeedbackProps> = ({
  status,
  platform,
  message,
  details,
  onRetry,
  onDismiss
}) => {
  if (!status) return null;
  
  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getVariant = () => {
    switch (status) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "default";
    }
  };
  
  return (
    <Alert variant={getVariant()} className="mt-4">
      {getIcon()}
      <AlertTitle>
        {status === "success" ? `${platform} Connected Successfully` :
         status === "error" ? `${platform} Connection Failed` :
         `${platform} Connection Warning`}
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{message}</p>
        {details && <p className="text-sm opacity-80">{details}</p>}
        
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-2">
            {onRetry && status === "error" && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry Connection
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionFeedback;
