
import React from "react";
import { ArrowLeft, Coins, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CreditPageHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Credit System</h1>
          <p className="text-muted-foreground">How credits work in AI AdGuru</p>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-md text-center">
            <p className="text-sm text-muted-foreground">Your Credits</p>
            <p className="text-2xl font-bold">{user.credits || 0}</p>
          </div>
          <Button onClick={() => navigate("/billing")}>
            <Coins className="mr-2 h-4 w-4" />
            Get More Credits
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreditPageHeader;
