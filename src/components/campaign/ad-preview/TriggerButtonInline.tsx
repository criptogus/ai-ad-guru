
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface TriggerButtonInlineProps {
  onSelectTrigger: (triggerText: string) => void;
  size?: "sm" | "default";
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({
  onSelectTrigger,
  size = "default"
}) => {
  // Get mental triggers from a utility function directly
  const getMentalTriggers = () => [
    "Limited Time Offer",
    "Exclusive Deal",
    "Save Up To 50%",
    "Free Shipping",
    "Buy Now",
    "Act Fast",
    "New Arrival",
    "Best Seller",
    "Sale Ends Soon",
    "Join Now",
    "Don't Miss Out",
    "Special Promotion"
  ];
  
  const triggers = getMentalTriggers();
  const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)];

  return (
    <Button
      variant="outline"
      size={size}
      className="gap-1 group"
      onClick={() => onSelectTrigger(randomTrigger)}
    >
      <Sparkles className="h-3.5 w-3.5 text-blue-500 group-hover:text-blue-600" />
      <span>Add trigger</span>
    </Button>
  );
};

export default TriggerButtonInline;
