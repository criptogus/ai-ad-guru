
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Base Stripe checkout URL - we'll generate one dynamically instead
  const baseStripeCheckoutUrl = "https://buy.stripe.com/test_7sIcNy8yG0jWgpy3cc";

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Option 1: Use direct Stripe checkout URL with client_reference_id
      // This is a simple approach that works for basic use cases
      const checkoutUrl = `${baseStripeCheckoutUrl}?client_reference_id=${user.id}`;
      console.log(`Opening Stripe checkout for user: ${user.id}`);
      window.open(checkoutUrl, "_blank");
      
      /* Option 2: Use our edge function to create a checkout session
      // Uncomment this to use the edge function instead of direct URL
      console.log("Creating checkout session for user:", user.id);
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { 
          userId: user.id,
          returnUrl: window.location.origin + "/billing"
        }
      });
      
      if (error) {
        console.error("Error creating checkout session:", error);
        throw new Error(error.message || "Could not create checkout session");
      }
      
      if (!data?.url) {
        throw new Error("No checkout URL returned");
      }
      
      console.log("Checkout session created, redirecting to:", data.url);
      window.open(data.url, "_blank");
      */
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout error",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-amber-800">Please log in to subscribe to our Pro plan.</p>
        <Button 
          className="mt-2" 
          variant="outline"
          onClick={() => navigate("/login", { state: { from: location.pathname } })}
        >
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Button 
        className="w-full" 
        size="lg" 
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Processing...
          </>
        ) : (
          <>
            Subscribe Now <ExternalLink className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
      <p className="text-sm text-gray-500 mt-2 text-center">
        You'll be redirected to Stripe's secure checkout page.
      </p>
    </div>
  );
};

export default StripeBuyButton;
