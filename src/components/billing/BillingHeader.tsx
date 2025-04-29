
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Beaker } from "lucide-react";

interface BillingHeaderProps {
  toggleDevTools: () => void;
}

const BillingHeader: React.FC<BillingHeaderProps> = ({ toggleDevTools }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage your credits and purchases</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate("/billing/history")}
        >
          <History size={16} />
          <span>Billing History</span>
        </Button>
        
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
    </div>
  );
};

export default BillingHeader;
