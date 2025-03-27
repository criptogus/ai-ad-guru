
import React, { useState, MouseEvent } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import TriggerGallery from "./TriggerGallery";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";

interface TriggerButtonProps extends ButtonProps {
  onSelectTrigger: (trigger: string) => void;
  buttonText?: string;
  tooltip?: string;
}

export const TriggerButton: React.FC<TriggerButtonProps> = ({
  onSelectTrigger,
  buttonText = "Add Mind Trigger",
  tooltip = "Add psychological triggers to make your ad more effective",
  size,
  variant,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleSelectTrigger = (trigger: string) => {
    // Call the callback without any additional logic
    onSelectTrigger(trigger);
    setOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              size={size}
              variant={variant}
              className={className}
              {...props}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TriggerGallery
        open={open}
        onOpenChange={handleOpenChange}
        onSelectTrigger={handleSelectTrigger}
      />
    </>
  );
};
