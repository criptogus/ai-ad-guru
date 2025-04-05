
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TriggerButtonInlineProps {
  onInsert: (trigger: string) => void;
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({ onInsert }) => {
  // Common mental triggers that work well in ads
  const triggers = [
    "Limited Time Offer",
    "Exclusive Deal",
    "Save Up To 50%",
    "Free Shipping",
    "Buy Now",
    "Act Fast",
    "New Arrival",
    "Best Seller",
    "Sale Ends Soon",
    "Join Now"
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Sparkles className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {triggers.map((trigger) => (
          <DropdownMenuItem
            key={trigger}
            onClick={() => onInsert(trigger)}
            className="cursor-pointer"
          >
            {trigger}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TriggerButtonInline;
