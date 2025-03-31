
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center">
        <Button 
          size="lg" 
          className="bg-brand-600 hover:bg-brand-700 text-white"
          onClick={() => navigate("/auth/login")}
        >
          <LogIn className="mr-2 h-5 w-5" />
          Log in to your account
        </Button>
      </div>
    </div>
  );
};
