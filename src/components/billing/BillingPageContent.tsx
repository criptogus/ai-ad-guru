
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Beaker, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BillingSubscriptionCard from "./BillingSubscriptionCard";
import CreditsPurchaseCard from "./CreditsPurchaseCard";
import DevToolsSection from "./DevToolsSection";

interface BillingPageContentProps {
  showDevTools: boolean;
  toggleDevTools: () => void;
}

const BillingPageContent: React.FC<BillingPageContentProps> = ({ 
  showDevTools, 
  toggleDevTools 
}) => {
  const navigate = useNavigate();
  const { user, updateUserPaymentStatus } = useAuth();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription</p>
          </div>
        </div>
        
        {/* Developer mode toggle button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleDevTools}
          className="flex items-center gap-1"
        >
          <Beaker size={16} />
          <span>Dev Tools</span>
        </Button>
      </div>
      
      {/* Developer tools section */}
      {showDevTools && (
        <DevToolsSection updateUserPaymentStatus={updateUserPaymentStatus} />
      )}
      
      <div className="mb-8 space-y-8">
        {/* Subscription Card */}
        <BillingSubscriptionCard 
          user={user} 
          updateUserPaymentStatus={updateUserPaymentStatus} 
        />
        
        {/* Credits Purchase Card */}
        <CreditsPurchaseCard />
      </div>
    </div>
  );
};

export default BillingPageContent;
