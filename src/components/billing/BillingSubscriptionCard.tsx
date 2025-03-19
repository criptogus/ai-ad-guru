
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BillingFeatures from "./BillingFeatures";
import StripeBuyButton from "./StripeBuyButton";
import { CustomUser } from "@/types/auth";

interface BillingSubscriptionCardProps {
  user: CustomUser | null;
  updateUserPaymentStatus: (hasPaid: boolean) => Promise<void>;
}

const BillingSubscriptionCard: React.FC<BillingSubscriptionCardProps> = ({ 
  user, 
  updateUserPaymentStatus 
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Ad Guru Pro</CardTitle>
        <CardDescription>
          Unlock unlimited AI-powered ad campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BillingFeatures />
        <div className="text-center mt-6 space-y-2">
          <p className="text-3xl font-bold">$99.00</p>
          <p className="text-muted-foreground">per month</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        {user?.hasPaid ? (
          <div className="text-center space-y-4">
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-block">
              Active Subscription
            </div>
            <p className="text-muted-foreground">
              Your subscription is active. You have access to all premium features.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => updateUserPaymentStatus(false)}
            >
              Cancel Subscription
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <StripeBuyButton 
              isAuthenticated={!!user}
              userId={user?.id} 
              customerEmail={user?.email}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default BillingSubscriptionCard;
