
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface StripeBuyButtonProps {
  isAuthenticated?: boolean;
  userId?: string;
  customerEmail?: string;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ 
  isAuthenticated = false,
  userId,
  customerEmail
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Create a checkout session via edge function
      const { data, error: functionError } = await supabase.functions.invoke("create-checkout-session", {
        body: { 
          userId: user.id,
          planId: 'subscription',
          returnUrl: window.location.origin + "/billing"
        }
      });
      
      if (functionError) {
        throw new Error(functionError.message || "Failed to create checkout session");
      }
      
      if (!data?.url) {
        throw new Error("No checkout URL returned");
      }
      
      window.location.href = data.url;
      
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
