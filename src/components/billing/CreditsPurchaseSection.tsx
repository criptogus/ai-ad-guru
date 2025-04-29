
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CreditsPurchaseCard from "./CreditsPurchaseCard";

interface CreditsPurchaseSectionProps {
  userId?: string;
  credits?: number;
}

const CreditsPurchaseSection: React.FC<CreditsPurchaseSectionProps> = ({ userId, credits }) => {
  if (userId && typeof credits === 'number') {
    return <CreditsPurchaseCard userId={userId} currentCredits={credits} />;
  }
  
  return (
    <Card className="p-8">
      <Skeleton className="h-8 w-64 mb-3" />
      <Skeleton className="h-4 w-full max-w-xl mb-6" />
      <Skeleton className="h-40 w-full" />
    </Card>
  );
};

export default CreditsPurchaseSection;
