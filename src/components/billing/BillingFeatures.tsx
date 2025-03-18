
import React from "react";
import { CheckCircle } from "lucide-react";

const BillingFeatures: React.FC = () => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <span>400 credits per month (1 campaign = 5 credits)</span>
      </div>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <span>AI-generated ad copy and images</span>
      </div>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <span>Google & Meta ad campaign management</span>
      </div>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <span>24-hour automated campaign optimization</span>
      </div>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <span>10% of ad spend fee via Stripe</span>
      </div>
    </div>
  );
};

export default BillingFeatures;
