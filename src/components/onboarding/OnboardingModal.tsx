
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Database, 
  MessageSquare, 
  Layout, 
  CheckCircle2 
} from "lucide-react";

const steps = [
  {
    title: "Welcome to AI AdGuru!",
    description: "Get started by following these quick steps to set up your account and create your first campaign.",
    icon: <Layout className="h-12 w-12 text-blue-500" />,
  },
  {
    title: "Connect Your Ad Platforms",
    description: "Link your Google Ads, Meta Ads, or LinkedIn accounts to start managing campaigns.",
    icon: <Database className="h-12 w-12 text-blue-500" />,
    buttonText: "Connect Platforms",
    route: "/config",
  },
  {
    title: "Get Credits",
    description: "Purchase credits to create AI-generated ad campaigns. Each ad campaign uses 5-10 credits depending on complexity.",
    icon: <CreditCard className="h-12 w-12 text-blue-500" />,
    buttonText: "Buy Credits",
    route: "/billing",
  },
  {
    title: "Create Your First Campaign",
    description: "Use our AI-powered campaign wizard to generate compelling ads that convert.",
    icon: <MessageSquare className="h-12 w-12 text-blue-500" />,
    buttonText: "Create Campaign",
    route: "/create-campaign",
  },
  {
    title: "You're All Set!",
    description: "You're ready to create and manage AI-powered ad campaigns across multiple platforms!",
    icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
  },
];

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };
  
  const handleSkip = () => {
    onOpenChange(false);
  };
  
  const handleActionButton = () => {
    const route = steps[currentStep]?.route;
    if (route) {
      navigate(route);
      onOpenChange(false);
    }
  };
  
  const step = steps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {step.icon}
          </div>
          <DialogTitle className="text-xl text-center">{step.title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2 mt-4">
          <Button variant="outline" onClick={handleSkip}>
            {currentStep < steps.length - 1 ? "Skip Tour" : "Close"}
          </Button>
          <div className="flex gap-2">
            {step.buttonText && step.route && (
              <Button onClick={handleActionButton}>
                {step.buttonText}
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
