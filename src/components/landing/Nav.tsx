
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink } from "lucide-react";

export const Nav: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold">
              ZD
            </div>
            <span className="ml-2 text-xl font-bold">Zero Digital Agency</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 mr-4">
            <a 
              href="https://blog.zeroagency.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-brand-600 flex items-center"
            >
              Blog <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/register")}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
