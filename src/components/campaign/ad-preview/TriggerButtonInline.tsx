
import React from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMentalTriggers } from "@/hooks/useMentalTriggers";

export interface TriggerButtonInlineProps {
  onInsert: (trigger: string) => void;
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({ onInsert }) => {
  const { triggers } = useMentalTriggers();
  const [open, setOpen] = React.useState(false);

  const handleSelectTrigger = (trigger: string) => {
    onInsert(trigger);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          title="Insert psychological trigger"
        >
          <Wand2 className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium text-sm">Insert Mind Trigger</h4>
          <p className="text-xs text-muted-foreground">
            Select a psychological trigger to enhance your ad
          </p>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {triggers.map((trigger, index) => (
            <div
              key={index}
              className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
              onClick={() => handleSelectTrigger(trigger.text)}
            >
              <p className="text-sm font-medium">{trigger.name}</p>
              <p className="text-xs text-muted-foreground">{trigger.text}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TriggerButtonInline;
