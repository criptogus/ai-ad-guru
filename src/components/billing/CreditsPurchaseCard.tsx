
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { CheckCircle } from "lucide-react";

const CreditsPurchaseCard: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Buy Additional Credits</CardTitle>
        <CardDescription>
          Add more credits to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span>Create additional campaigns</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span>Generate more AI ad variations</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span>One-time purchase (no subscription)</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span>200 credits per purchase</span>
          </div>
        </div>
        <div className="text-center mt-6 space-y-2">
          <p className="text-3xl font-bold">$49.99</p>
          <p className="text-muted-foreground">one-time payment</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <div className="w-full">
          <Button 
            className="w-full" 
            onClick={() => window.open("https://buy.stripe.com/dR62brdyV4jR1XO7sv", "_blank")}
          >
            Buy Credits <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            You'll be redirected to Stripe's secure checkout page.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreditsPurchaseCard;
