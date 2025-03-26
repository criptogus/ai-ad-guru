
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface TriggerButtonInlineProps {
  onInsert: (text: string) => void;
  className?: string;
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({ onInsert, className = "" }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`h-6 px-2 ${className}`}>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {triggers.map((trigger) => (
          <DropdownMenuItem 
            key={trigger.id}
            onClick={() => onInsert(trigger.text)}
            className="cursor-pointer"
          >
            {trigger.text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const triggers = [
  { id: "scarcity", text: "Limited Time Offer" },
  { id: "urgency", text: "Act Now" },
  { id: "social-proof", text: "Trusted by Thousands" },
  { id: "curiosity", text: "Discover How" },
  { id: "value", text: "Save 50% Today" },
  { id: "fear", text: "Don't Miss Out" },
  { id: "exclusivity", text: "Exclusive Access" }
];

// Export both as named export and default export
export { TriggerButtonInline };
export default TriggerButtonInline;
