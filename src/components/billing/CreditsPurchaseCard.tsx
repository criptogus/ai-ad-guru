
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Check } from "lucide-react";

interface PlanOption {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  popular?: boolean;
}

const planOptions: PlanOption[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for trying out the platform",
    price: 49,
    credits: 100
  },
  {
    id: "pro",
    name: "Professional",
    description: "Most popular for small businesses",
    price: 99,
    credits: 250,
    popular: true
  },
  {
    id: "agency",
    name: "Agency",
    description: "For agencies or multiple campaigns",
    price: 249,
    credits: 700
  }
];

const CreditsPurchaseCard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePurchase = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase credits.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          planId: planId,
          returnUrl: window.location.origin + "/billing"
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to create checkout session");
      }
      
      if (!response.data?.url) {
        throw new Error("No checkout URL returned");
      }
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Error creating checkout",
        description: error.message || "Could not create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlan = (id: string) => planOptions.find(plan => plan.id === id);
  const selectedPlanDetails = getPlan(selectedPlan);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>
          Choose a credit package to power your AI ad campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {planOptions.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:border-gray-300 dark:hover:border-gray-600'
              } ${plan.popular ? 'relative' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Popular
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{plan.name}</h3>
                  <div className="mt-1 text-2xl font-bold">${plan.price}</div>
                </div>
                {selectedPlan === plan.id && (
                  <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{plan.description}</div>
              <div className="mt-2 flex items-center gap-1">
                <span className="font-medium">{plan.credits}</span>
                <span className="text-sm text-muted-foreground">credits</span>
              </div>
            </div>
          ))}
        </div>
        
        {selectedPlanDetails && (
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-medium">Plan Summary</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span>{selectedPlanDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits</span>
                <span>{selectedPlanDetails.credits}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">${selectedPlanDetails.price}.00</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          disabled={isLoading || !selectedPlanDetails}
          onClick={() => handlePurchase(selectedPlan)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreditsPurchaseCard;
