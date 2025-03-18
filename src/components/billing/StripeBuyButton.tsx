
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      script.onload = () => {
        console.log('Stripe Buy Button script loaded');
        
        // Get the current URL for the redirect
        const currentUrl = window.location.origin;
        const returnUrl = `${currentUrl}/billing`;

        // If there's a Stripe button container and the user is authenticated, customize it
        if (containerRef.current && user) {
          // Remove any existing button first
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }

          // Create the button with additional metadata
          const buttonElement = document.createElement('stripe-buy-button');
          buttonElement.setAttribute('buy-button-id', 'buy_btn_1R2GrvEXrJH93iAslqq4hLcL');
          buttonElement.setAttribute('publishable-key', 'pk_live_51R2FeWEXrJH93iAsggEd0ejUkIiLIoPwJLjg9Uojh3OI5qxWrU2MgXDqqgW20QBn8W3KqNbGP2LGx411c1Or7ivj00B2PPmNYj');
          
          // Add user metadata and success URL to help with verification
          buttonElement.setAttribute('client-reference-id', user.id);
          buttonElement.setAttribute('success-url', `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`);
          buttonElement.setAttribute('cancel-url', returnUrl);
          
          containerRef.current.appendChild(buttonElement);
        }
      };
      document.body.appendChild(script);
    }
  }, [user]);

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
    <div className="stripe-buy-button-container mt-6" ref={containerRef}>
      <div id="stripe-buy-button">
        {/* This div will be replaced by the dynamically created Stripe button */}
      </div>
    </div>
  );
};

export default StripeBuyButton;
