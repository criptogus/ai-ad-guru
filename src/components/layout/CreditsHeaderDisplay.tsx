
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CreditsHeaderDisplay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const isLowCredits = (user.credits || 0) < 50;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-1.5 px-3 py-1 h-8 rounded-full border transition-all duration-200 hover:shadow-md
              ${isLowCredits ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'border-brand-200 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'}`}
            onClick={() => navigate("/credits-info")}
          >
            <Coins className="h-3.5 w-3.5" />
            <span className="font-medium">{user.credits || 0}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your available credits - Click to learn more</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreditsHeaderDisplay;
