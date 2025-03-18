
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StripeBuyButtonProps {
  isAuthenticated: boolean;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      script.onload = () => {
        console.log('Stripe Buy Button script loaded');
      };
      document.body.appendChild(script);
    }
  }, []);

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
        {/* This div will be replaced by Stripe's buy button */}
        <stripe-buy-button
          buy-button-id="buy_btn_1R2GrvEXrJH93iAslqq4hLcL"
          publishable-key="pk_live_51R2FeWEXrJH93iAsggEd0ejUkIiLIoPwJLjg9Uojh3OI5qxWrU2MgXDqqgW20QBn8W3KqNbGP2LGx411c1Or7ivj00B2PPmNYj"
        ></stripe-buy-button>
      </div>
    </div>
  );
};

export default StripeBuyButton;
