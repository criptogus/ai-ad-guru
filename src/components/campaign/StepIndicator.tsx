
import React from "react";
import { Check } from "lucide-react";

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
        className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 
        ${active ? "bg-brand-600 text-white" : ""} 
        ${completed ? "bg-green-600 text-white" : ""} 
        ${!active && !completed ? "border-2 border-muted-foreground/30 text-muted-foreground" : ""}`}
      >
        {completed ? <Check size={20} /> : number}
      </div>
      <span className={`${active ? "font-medium" : ""} ${completed ? "font-medium" : ""}`}>
        {title}
      </span>
    </div>
  );
};

export default StepIndicator;
