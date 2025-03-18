
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink } from "lucide-react";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Stripe checkout direct link
  const stripeCheckoutUrl = "https://buy.stripe.com/test_7sIcNy8yG0jWgpy3cc";

  const handleCheckout = () => {
    // Open the Stripe checkout in a new window
    window.open(stripeCheckoutUrl, "_blank");
    
    // If we have a user, we should try to associate this payment with them
    // This is done through the webhook, but we'll also display a message
    if (user) {
      console.log("Opening Stripe checkout for user:", user.id);
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
      >
        Subscribe Now <ExternalLink className="ml-1 h-4 w-4" />
      </Button>
      <p className="text-sm text-gray-500 mt-2 text-center">
        You'll be redirected to Stripe's secure checkout page.
      </p>
    </div>
  );
};

export default StripeBuyButton;
