
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {timeOfDay}, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your campaigns
        </p>
      </div>
      <div className="flex gap-3 self-end sm:self-auto">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search campaigns..."
            className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background h-10 w-[200px] focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button onClick={() => navigate("/create-campaign")} className="gap-2">
          <PlusCircle size={18} />
          <span>Create Campaign</span>
        </Button>
      </div>
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
