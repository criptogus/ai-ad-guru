
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  number: number; 
  title: string; 
  active: boolean; 
  completed: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ number, title, active, completed }) => {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center mr-3 transition-all duration-200",
          active ? "bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2" : "",
          completed ? "bg-green-600 text-white" : "",
          !active && !completed ? "border-2 border-muted-foreground/30 text-muted-foreground" : ""
        )}
      >
        {completed ? <Check size={20} /> : number}
      </div>
      <span className={cn(
        "transition-colors",
        active ? "font-semibold text-primary" : "",
        completed ? "font-medium text-green-600" : "",
        !active && !completed ? "text-muted-foreground" : ""
      )}>
        {title}
      </span>
    </div>
  );
};

export default StepIndicator;
