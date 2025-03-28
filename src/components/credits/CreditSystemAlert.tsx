
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const CreditSystemAlert = () => {
  return (
    <Alert className="bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-200">
      <Info className="h-4 w-4" />
      <AlertTitle className="text-left">What are credits?</AlertTitle>
      <AlertDescription className="text-left">
        Credits are the currency used within AI AdGuru to generate AI content, create campaigns, and optimize your ads.
        Different features consume different amounts of credits.
      </AlertDescription>
    </Alert>
  );
};

export default CreditSystemAlert;
