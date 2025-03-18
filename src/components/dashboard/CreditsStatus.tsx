
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Star } from "lucide-react";
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
    <Card className="h-full">
      <CardContent className="py-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <Star className="h-4 w-4 mr-2 text-amber-500" />
              Credits Status
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigate("/billing")}>
              <DollarSign size={14} className="mr-1" />
              Buy More
            </Button>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-4 mb-4">
            <div className="text-3xl font-bold mb-1">{user?.credits}</div>
            <div className="text-sm text-muted-foreground mb-3">Available credits</div>
            <Progress value={usedPercentage} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{user?.credits} used</span>
              <span>{totalCredits} total</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-auto">
            {user?.hasPaid ? (
              <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Premium account active
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p>Upgrade to premium for unlimited campaigns</p>
                <Button size="sm" onClick={() => navigate("/billing")}>
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsStatus;
