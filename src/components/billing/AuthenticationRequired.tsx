
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const AuthenticationRequired: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please log in to access billing and subscription features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="mb-6 text-muted-foreground">
            You need to be logged in to manage your subscription and billing information.
          </p>
          <Button 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => navigate("/login", { state: { from: location.pathname } })}
          >
            <LogIn size={18} />
            <span>Go to Login</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationRequired;
