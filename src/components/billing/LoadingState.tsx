
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Loading Billing Information</h1>
        <p className="text-muted-foreground">Please wait while we prepare your credit options...</p>
      </div>
    </div>
  );
};

export default LoadingState;
