
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  avatar?: string;
}

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your campaigns</p>
      </div>
      <Button onClick={() => navigate("/create-campaign")} className="gap-2">
        <PlusCircle size={18} />
        <span>Create Campaign</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
