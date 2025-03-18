
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Direct checkout link provided by the user
  const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_7sIcNy8yG0jWgpy3cc";

  // Handle the redirect to Stripe checkout
  const handleCheckout = () => {
    // Get the current URL for the redirect back after payment
    const currentUrl = window.location.origin;
    const returnUrl = `${currentUrl}/billing`;
    
    // Construct the checkout URL with client reference ID and return URL
    let checkoutUrl = STRIPE_CHECKOUT_URL;
    
    // Add client reference ID if user is available
    if (user) {
      // Append user ID as a query parameter for tracking
      const separator = checkoutUrl.includes('?') ? '&' : '?';
      checkoutUrl = `${checkoutUrl}${separator}client_reference_id=${user.id}`;
      
      // Add success and cancel URLs for proper redirection
      checkoutUrl = `${checkoutUrl}&success_url=${encodeURIComponent(`${returnUrl}?session_id={CHECKOUT_SESSION_ID}`)}&cancel_url=${encodeURIComponent(returnUrl)}`;
    }
    
    console.log("Redirecting to Stripe checkout:", checkoutUrl);
    
    // Redirect to the Stripe checkout page
    window.location.href = checkoutUrl;
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
        className="w-full py-6 text-lg font-semibold" 
        onClick={handleCheckout}
      >
        Subscribe Now
      </Button>
    </div>
  );
};

export default StripeBuyButton;
