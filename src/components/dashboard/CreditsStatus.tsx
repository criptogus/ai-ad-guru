
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  avatar?: string;
}

interface CreditsStatusProps {
  user: User | null;
}

const CreditsStatus: React.FC<CreditsStatusProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Credits Status</h2>
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-lg">Available Credits</h3>
              <p className="text-muted-foreground">Your monthly plan includes 400 credits</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{user?.credits} credits</div>
              <Button variant="outline" onClick={() => navigate("/billing")}>
                <DollarSign size={16} className="mr-2" />
                Buy More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditsStatus;
