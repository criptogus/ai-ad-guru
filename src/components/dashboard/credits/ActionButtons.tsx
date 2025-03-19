
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreditHistoryDialog from "./CreditHistoryDialog";

interface ActionButtonsProps {
  hasPaid?: boolean;
  userId?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ hasPaid, userId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-2">
      <Button 
        className="w-full" 
        variant={hasPaid ? "outline" : "default"}
        onClick={() => navigate("/billing")}
      >
        {hasPaid ? "Manage Subscription" : "Upgrade to Premium"}
      </Button>
      
      <Button
        className="w-full"
        variant="outline"
        onClick={() => navigate("/billing")}
      >
        <Plus className="mr-1 h-4 w-4" /> Buy More Credits
      </Button>
      
      {userId && (
        <CreditHistoryDialog userId={userId} />
      )}
    </div>
  );
};

export default ActionButtons;
