
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  CreditCostInfo,
  CreditProgressBar,
  AccountStatusAlert,
  ActionButtons
} from "./credits";

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
  // Calculate percentage of credits used
  const totalCredits = 400; // Maximum credits for the plan
  const currentCredits = user?.credits || 0;
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

        <CreditProgressBar 
          currentCredits={currentCredits}
          totalCredits={totalCredits}
          isLowCredits={isLowCredits}
        />

        <AccountStatusAlert 
          isLowCredits={isLowCredits}
          hasPaid={user?.hasPaid}
        />
        
        <ActionButtons 
          hasPaid={user?.hasPaid}
          userId={user?.id}
        />
      </CardContent>
    </Card>
  );
};

export default CreditsStatus;
