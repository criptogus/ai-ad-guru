
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CreateCampaignButton = () => {
  return (
    <Link to="/ad-manager">
      <Button className="w-full flex items-center justify-center gap-2" variant="default">
        <Plus className="h-4 w-4" />
        <span>Create Ad</span>
      </Button>
    </Link>
  );
};

export default CreateCampaignButton;
