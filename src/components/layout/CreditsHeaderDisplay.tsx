
import React from "react";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CreditsHeaderDisplay: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const credits = user.credits || 0;
  const isLowCredits = credits < 50;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => navigate("/credits-info")}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mr-2 font-normal",
              isLowCredits ? "border-orange-300 text-orange-700 dark:text-orange-400" : ""
            )}
          >
            <Coins className={`h-4 w-4 mr-1.5 ${isLowCredits ? "text-orange-500" : "text-primary"}`} />
            <span>{credits}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{credits} credits available</p>
          <p className="text-xs text-muted-foreground mt-1">Click for credit info</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreditsHeaderDisplay;
