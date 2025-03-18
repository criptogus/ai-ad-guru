
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface User {
  name: string;
  credits: number;
  hasPaid?: boolean;
  id?: string;
  email?: string;
  avatar?: string;
}

interface CreditsStatusProps {
  user: User | null;
}

const CreditsStatus: React.FC<CreditsStatusProps> = ({ user }) => {
  const navigate = useNavigate();

  // Calculate percentage of credits used
  const totalCredits = 400; // Maximum credits
  const usedPercentage = user ? (user.credits / totalCredits) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium mb-3">Credits Available</h3>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <div className="text-3xl font-medium">{user?.credits || 0}</div>
            <div className="text-sm text-muted-foreground">of {totalCredits}</div>
          </div>
          <Progress value={usedPercentage} className="h-2" />
        </div>

        {user?.hasPaid ? (
          <div className="flex items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-green-700 dark:text-green-400">Premium account active</span>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Upgrade to premium for unlimited campaigns</p>
          </div>
        )}
        
        <Button 
          className="w-full" 
          variant={user?.hasPaid ? "outline" : "default"}
          onClick={() => navigate("/billing")}
        >
          {user?.hasPaid ? "Manage Subscription" : "Upgrade to Premium"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreditsStatus;
