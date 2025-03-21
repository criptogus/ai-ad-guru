
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();

  const handleBackToCampaigns = () => {
    navigate("/campaigns");
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleBackToCampaigns}>
          Back to Campaigns
        </Button>
        <Button 
          className="gap-1" 
          onClick={() => toast.info("Smart Banner Builder Beta", { 
            description: "This feature is in beta. 8 credits will be used per banner generation." 
          })}
        >
          <Sparkles size={16} />
          Beta
        </Button>
      </div>
    </div>
  );
};

export default Header;
