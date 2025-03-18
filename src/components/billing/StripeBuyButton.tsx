
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    
    try {
      console.log(`Starting checkout process for user: ${user.id}`);
      
      // Try to use the edge function first
      try {
        console.log("Attempting to create checkout session via edge function");
        const { data, error: functionError } = await supabase.functions.invoke("create-checkout-session", {
          body: { 
            userId: user.id,
            returnUrl: window.location.origin + "/billing"
          }
        });
        
        if (functionError) {
          console.error("Error from create-checkout-session edge function:", functionError);
          throw new Error(functionError.message || "Failed to create checkout session");
        }
        
        if (!data?.url) {
          console.error("No checkout URL returned from edge function");
          throw new Error("No checkout URL returned");
        }
        
        console.log("Checkout session created successfully, redirecting to:", data.url);
        window.open(data.url, "_blank");
        return;
      } catch (edgeFunctionError) {
        console.error("Edge function error, falling back to direct URL:", edgeFunctionError);
        // Fall back to direct URL approach
      }
      
      // Fallback: Use direct Stripe checkout URL with client_reference_id
      console.log("Using fallback direct URL approach");
      const checkoutUrl = `${baseStripeCheckoutUrl}?client_reference_id=${user.id}`;
      console.log(`Opening Stripe checkout via direct URL for user: ${user.id}`);
      window.open(checkoutUrl, "_blank");
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to start checkout process. Please try again.");
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
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
