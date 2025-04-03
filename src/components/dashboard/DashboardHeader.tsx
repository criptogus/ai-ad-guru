
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface User {
  name: string;
  credits?: number;
  hasPaid?: boolean;
  id?: string;
  email?: string;
  avatar?: string;
}

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const timeOfDay = getTimeOfDay();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-accent/50 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">
          {timeOfDay}, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your campaigns
        </p>
      </div>
      <Button onClick={() => navigate("/create-campaign")} className="gap-2 whitespace-nowrap min-w-[160px]">
        <PlusCircle size={18} />
        <span>Create Campaign</span>
      </Button>
    </div>
  );
};

// Helper function to get time of day greeting
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default DashboardHeader;
