
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useMindTriggers } from "@/hooks/useMindTriggers";

export interface TriggerButtonInlineProps {
  onSelectTrigger?: (triggerText: string) => void;
  onInsert?: (triggerText: string) => void;
  size?: "sm" | "default";
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({
  onSelectTrigger,
  onInsert,
  size = "default"
}) => {
  // Get mental triggers from useMindTriggers hook
  const { getTriggers } = useMindTriggers();
  const triggers = getTriggers();
  
  // Select a random trigger from available triggers
  const getRandomTrigger = () => {
    if (triggers.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * triggers.length);
    return triggers[randomIndex].text;
  };

  const handleTriggerClick = () => {
    const randomTrigger = getRandomTrigger();
    
    // Call both handlers if provided for backward compatibility
    if (onSelectTrigger) {
      onSelectTrigger(randomTrigger);
    }
    if (onInsert) {
      onInsert(randomTrigger);
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      className="gap-1 group"
      onClick={handleTriggerClick}
    >
      <Sparkles className="h-3.5 w-3.5 text-blue-500 group-hover:text-blue-600" />
      <span>Add trigger</span>
    </Button>
  );
};

export default TriggerButtonInline;
