
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Info, Plus, AlertTriangle } from "lucide-react";
import { getCreditCosts } from "@/services/userRoles";

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

const CreditCostInfo = () => {
  const creditCosts = getCreditCosts();
  
  return (
    <div className="space-y-3 my-2">
      <div className="border rounded-md p-3">
        <p className="font-medium mb-1">Campaign Creation</p>
        <p className="text-sm text-muted-foreground">
          {creditCosts.campaignCreation} credits per campaign
        </p>
      </div>
      
      <div className="border rounded-md p-3">
        <p className="font-medium mb-1">AI Optimization</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Daily: {creditCosts.aiOptimization.daily} credits per cycle</p>
          <p>Every 3 Days: {creditCosts.aiOptimization.every3Days} credits per cycle</p>
          <p>Weekly: {creditCosts.aiOptimization.weekly} credits per cycle</p>
        </div>
      </div>
      
      <div className="border rounded-md p-3">
        <p className="font-medium mb-1">Image Generation</p>
        <p className="text-sm text-muted-foreground">
          {creditCosts.imageGeneration} credits per image
        </p>
      </div>
    </div>
  );
};

const CreditsStatus: React.FC<CreditsStatusProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showCreditsInfo, setShowCreditsInfo] = useState(false);

  // Calculate percentage of credits used
  const totalCredits = 400; // Maximum credits for the plan
  const usedPercentage = user ? (user.credits / totalCredits) * 100 : 0;
  const isLowCredits = user && user.credits < 50;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Credits Available</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
                <span className="sr-only">Credit Information</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Credit System</DialogTitle>
                <DialogDescription>
                  Credits are used for various actions in the platform. Here's what each action costs:
                </DialogDescription>
              </DialogHeader>
              <CreditCostInfo />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <div className="text-3xl font-medium">{user?.credits || 0}</div>
            <div className="text-sm text-muted-foreground">of {totalCredits}</div>
          </div>
          <Progress 
            value={usedPercentage} 
            className="h-2" 
            indicatorClassName={isLowCredits ? "bg-amber-500" : undefined}
          />
        </div>

        {isLowCredits && (
          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm text-amber-700 dark:text-amber-400">
              Credits running low. Consider purchasing more.
            </span>
          </div>
        )}

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
        
        <div className="space-y-2">
          <Button 
            className="w-full" 
            variant={user?.hasPaid ? "outline" : "default"}
            onClick={() => navigate("/billing")}
          >
            {user?.hasPaid ? "Manage Subscription" : "Upgrade to Premium"}
          </Button>
          
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/billing")}
          >
            <Plus className="mr-1 h-4 w-4" /> Buy More Credits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsStatus;
