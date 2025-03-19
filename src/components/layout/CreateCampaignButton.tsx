
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateCampaignButtonProps {
  collapsed: boolean;
}

const CreateCampaignButton: React.FC<CreateCampaignButtonProps> = ({ collapsed }) => {
  const navigate = useNavigate();

  return (
    <Button 
      className={cn(
        "my-4 gap-2 bg-blue-600 hover:bg-blue-700", 
        collapsed ? "px-2 aspect-square" : "w-full"
      )} 
      onClick={() => navigate("/campaigns/create")}
    >
      <PlusCircle size={collapsed ? 20 : 16} />
      {!collapsed && <span>Create Campaign</span>}
    </Button>
  );
};

export default CreateCampaignButton;
