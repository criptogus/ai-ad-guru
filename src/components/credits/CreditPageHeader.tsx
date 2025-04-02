
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditCard, Sparkles } from "lucide-react";

const CreditPageHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-amber-500" />
          Credits System
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and understand your credit usage
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 px-4 py-2 rounded-md">
          <div className="text-xs text-muted-foreground">Available Credits</div>
          <div className="text-xl font-bold">{user?.credits || 0}</div>
        </div>
        
        <Button onClick={() => navigate("/billing")}>
          <CreditCard className="mr-2 h-4 w-4" />
          Buy Credits
        </Button>
      </div>
    </div>
  );
};

export default CreditPageHeader;
