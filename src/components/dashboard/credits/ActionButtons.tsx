
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins, Info } from "lucide-react";

interface ActionButtonsProps {
  isLowCredits?: boolean;
  hasPaid?: boolean;
  userId?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isLowCredits = false, 
  hasPaid, 
  userId 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <Button 
        variant={isLowCredits ? "default" : "outline"} 
        className="w-full"
        onClick={() => navigate("/billing")}
      >
        <Coins className="mr-2 h-4 w-4" />
        {isLowCredits ? "Buy Credits" : "Add Credits"}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate("/credits-info")}
      >
        <Info className="mr-2 h-4 w-4" />
        Learn More
      </Button>
    </div>
  );
};

export default ActionButtons;
