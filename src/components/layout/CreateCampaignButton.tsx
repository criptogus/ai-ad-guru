
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreateCampaignButtonProps {
  collapsed: boolean;
}

const CreateCampaignButton: React.FC<CreateCampaignButtonProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Button 
      className={cn(
        "my-3 sm:my-4 gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700", 
        collapsed ? "px-1 sm:px-2 aspect-square" : "w-full"
      )} 
      onClick={() => navigate("/create-campaign")}
    >
      <PlusCircle size={collapsed ? 18 : 16} />
      {!collapsed && <span className="text-xs sm:text-sm">Create Campaign</span>}
    </Button>
  );
};

export default CreateCampaignButton;
