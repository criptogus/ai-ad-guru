
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useMentalTriggers } from "@/hooks/useMentalTriggers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TriggerButtonInlineProps {
  onInsert: (trigger: string) => void;
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({ onInsert }) => {
  const { getTriggers } = useMentalTriggers();
  const triggers = getTriggers();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          title="Insert mind trigger"
        >
          <Sparkles className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
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
