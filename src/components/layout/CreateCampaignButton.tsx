
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CreateCampaignButtonProps {
  collapsed?: boolean;
}

const CreateCampaignButton: React.FC<CreateCampaignButtonProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/create-campaign');
  };

  return (
    <div className="my-4">
      <Button
        onClick={handleCreateCampaign}
        className={cn(
          "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
          "text-white border-0 py-2 px-4 rounded transition-all duration-200 ease-in-out",
          collapsed ? "px-2 justify-center" : ""
        )}
      >
        <Plus className="h-4 w-4" />
        {!collapsed && <span className="ml-2">New Campaign</span>}
      </Button>
    </div>
  );
};

export default CreateCampaignButton;
