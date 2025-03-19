
import React, { useState, useEffect } from "react";
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
import { Info, Plus, AlertTriangle, History } from "lucide-react";
import { getCreditCosts, getCreditUsageHistory, CreditUsage } from "@/services/userRoles";

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
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">Campaign Creation</p>
        <p className="text-sm text-muted-foreground">
          {creditCosts.campaignCreation} credits per campaign
        </p>
      </div>
      
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">AI Optimization</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Daily: {creditCosts.aiOptimization.daily} credits per cycle</p>
          <p>Every 3 Days: {creditCosts.aiOptimization.every3Days} credits per cycle</p>
          <p>Weekly: {creditCosts.aiOptimization.weekly} credits per cycle</p>
        </div>
      </div>
      
      <div className="border rounded-md p-3 dark:border-gray-700">
        <p className="font-medium mb-1">Image Generation</p>
        <p className="text-sm text-muted-foreground">
          {creditCosts.imageGeneration} credits per image
        </p>
      </div>
    </div>
  );
};

const CreditHistoryDialog = ({ userId }: { userId: string }) => {
  const [creditHistory, setCreditHistory] = useState<CreditUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      const history = await getCreditUsageHistory(userId);
      setCreditHistory(history);
      setIsLoading(false);
    };

    if (userId) {
      loadHistory();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <History className="mr-2 h-4 w-4" /> View Credit History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Credit Usage History</DialogTitle>
          <DialogDescription>
            Your recent credit transactions and usage
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-4 text-center">Loading history...</div>
        ) : creditHistory.length === 0 ? (
          <div className="py-4 text-center">No credit history available</div>
        ) : (
          <div className="max-h-[400px] overflow-auto">
            <table className="w-full">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {creditHistory.map((item) => (
                  <tr key={item.id} className="border-b dark:border-gray-700">
                    <td className="py-2">{formatDate(item.createdAt)}</td>
                    <td className="py-2">{item.action.replace('_', ' ')}</td>
                    <td className="py-2">{item.description}</td>
                    <td className={`py-2 text-right ${item.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.amount < 0 ? '+' : '-'}{Math.abs(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CreditsStatus: React.FC<CreditsStatusProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showCreditsInfo, setShowCreditsInfo] = useState(false);

  // Calculate percentage of credits used
  const totalCredits = 400; // Maximum credits for the plan
  const currentCredits = user?.credits || 0;
  const usedPercentage = currentCredits > 0 ? (currentCredits / totalCredits) * 100 : 0;
  const isLowCredits = currentCredits < 50;
  
  return (
    <Card className="dark:bg-gray-800">
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
            <DialogContent className="dark:bg-gray-800">
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
            <div className="text-3xl font-medium">{currentCredits}</div>
            <div className="text-sm text-muted-foreground">of {totalCredits}</div>
          </div>
          <Progress 
            value={usedPercentage} 
            className="h-2 dark:bg-gray-700" 
            indicatorClassName={isLowCredits ? "bg-amber-500" : "bg-blue-600 dark:bg-blue-500"}
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
          
          {user?.id && (
            <CreditHistoryDialog userId={user.id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsStatus;
