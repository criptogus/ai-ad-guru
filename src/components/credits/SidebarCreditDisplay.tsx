
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCredits } from "@/contexts/CreditsContext";
import { Coins, CreditCard, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarCreditDisplayProps {
  collapsed?: boolean;
}

const SidebarCreditDisplay: React.FC<SidebarCreditDisplayProps> = ({ collapsed = false }) => {
  const { credits, loading } = useCredits();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const isLowCredits = credits < 20;
  
  const handleBuyCreditsClick = () => {
    navigate("/billing");
  };
  
  if (collapsed) {
    return (
      <div className="px-3 py-2">
        <button
          className={cn(
            "flex items-center justify-center w-full p-2 rounded-md transition-all duration-200",
            isLowCredits ? "bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300" : "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300"
          )}
          onClick={handleBuyCreditsClick}
          title={`${credits} credits available. Click to buy more.`}
        >
          <Coins className="h-5 w-5" />
        </button>
      </div>
    );
  }
  
  return (
    <div className="px-3 py-2 border-t dark:border-gray-800">
      <div className="space-y-1">
        <button
          className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Coins className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Credits</span>
          </div>
          <div className="flex items-center">
            <span className={cn(
              "text-sm font-semibold mr-2",
              isLowCredits ? "text-amber-600 dark:text-amber-400" : ""
            )}>
              {loading ? "..." : credits}
            </span>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </button>
        
        {isOpen && (
          <div className="pl-8 space-y-1">
            <button
              className="flex items-center w-full p-2 text-sm rounded-md hover:bg-accent text-left"
              onClick={handleBuyCreditsClick}
            >
              <CreditCard className="h-3 w-3 mr-2" />
              <span>Buy Credits</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarCreditDisplay;
