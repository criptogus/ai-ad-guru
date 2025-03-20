
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2, CreditCard, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface CreditOption {
  amount: number;
  price: number;
  stripeLink: string;
  bestValue?: boolean;
}

interface CreditsPurchaseCardProps {
  userId?: string;
  currentCredits?: number;
}

const CreditsPurchaseCard: React.FC<CreditsPurchaseCardProps> = ({ userId, currentCredits = 0 }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Credit options with actual Stripe links
  const creditOptions: CreditOption[] = [
    { 
      amount: 100, 
      price: 29, 
      stripeLink: "https://buy.stripe.com/00geYd1Qd6rZ1XO3ci" 
    },
    { 
      amount: 250, 
      price: 59, 
      bestValue: true, 
      stripeLink: "https://buy.stripe.com/4gw8zPcuR8A731S7sx" 
    },
    { 
      amount: 500, 
      price: 99, 
      stripeLink: "https://buy.stripe.com/cN2g2h8eB8A7eKA6os" 
    }
  ];

  const handlePurchase = (option: CreditOption) => {
    if (!userId) {
      return;
    }
    
    setRedirecting(true);
    
    // Store information about the purchase in localStorage for verification later
    localStorage.setItem('credit_purchase_intent', JSON.stringify({
      userId,
      amount: option.amount,
      price: option.price,
      timestamp: new Date().toISOString()
    }));
    
    // Open the Stripe checkout page in a new tab
    window.open(option.stripeLink, "_blank");
    
    // Reset the redirecting state after a short delay
    setTimeout(() => {
      setRedirecting(false);
      setSelectedOption(null);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Buy Additional Credits</CardTitle>
        <CardDescription>
          Add more credits to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Current balance: <span className="font-semibold text-base">{currentCredits} credits</span>
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {creditOptions.map((option) => (
              <div 
                key={option.amount}
                className={`border ${selectedOption === option.amount ? 'border-primary bg-primary/5' : 'border-border'} 
                  rounded-md p-4 cursor-pointer relative hover:border-primary/50 transition-colors`}
                onClick={() => setSelectedOption(option.amount)}
              >
                {option.bestValue && (
                  <div className="absolute -top-3 -right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    Best Value
                  </div>
                )}
                <p className="font-semibold text-xl">{option.amount} Credits</p>
                <p className="text-lg">${option.price}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${(option.price / option.amount * 100).toFixed(2)} per 100 credits
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
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
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <div className="w-full">
          <Button 
            className="w-full" 
            disabled={selectedOption === null || redirecting}
            onClick={() => {
              const selectedCreditOption = creditOptions.find(o => o.amount === selectedOption);
              if (selectedCreditOption) {
                handlePurchase(selectedCreditOption);
              }
            }}
          >
            {redirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Redirecting to Stripe...
              </>
            ) : (
              <>
                {selectedOption ? (
                  <>
                    Buy {selectedOption} Credits for ${creditOptions.find(o => o.amount === selectedOption)?.price}
                    <CreditCard className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Select a Credit Package
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </>
            )}
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
