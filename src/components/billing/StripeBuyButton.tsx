
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Add Stripe Buy Button script if it doesn't exist
    if (!document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Initialize the button after the script is loaded
    const initializeButton = () => {
      if (containerRef.current && user) {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Create the button element with the exact attributes provided
        const buttonElement = document.createElement('stripe-buy-button');
        buttonElement.setAttribute('buy-button-id', 'buy_btn_1R41hUEXrJH93iAs4hjVMyRE');
        buttonElement.setAttribute('publishable-key', 'pk_test_51R2FeWEXrJH93iAspEvhr575LSSa8CQjBYxioRJO5zK2KwDyKDWLGJNxdo4iSwW06HItJH8nmfzpsKkXqnUhkFPm00EoZb0cBm');
        
        // Add user ID as client reference ID for tracking
        if (user) {
          buttonElement.setAttribute('client-reference-id', user.id);
          
          // Set success and cancel URLs
          const currentUrl = window.location.origin;
          const returnUrl = `${currentUrl}/billing`;
          
          buttonElement.setAttribute('success-url', `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`);
          buttonElement.setAttribute('cancel-url', returnUrl);
        }
        
        containerRef.current.appendChild(buttonElement);
      }
    };
    
    // Check if script is already loaded
    if (document.querySelector('script[src*="buy-button.js"]')?.getAttribute('loaded') === 'true') {
      initializeButton();
    } else {
      // Set up event listener for script load
      const existingScript = document.querySelector('script[src*="buy-button.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          existingScript.setAttribute('loaded', 'true');
          initializeButton();
        });
      }
    }
    
    // Initialize button on component mount just in case script is already loaded
    setTimeout(initializeButton, 1000);
    
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
    <div className="mt-6" ref={containerRef}>
      {/* Stripe Buy Button will be injected here */}
    </div>
  );
};

export default StripeBuyButton;
