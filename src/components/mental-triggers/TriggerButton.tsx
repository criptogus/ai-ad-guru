
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TriggerGallery from './TriggerGallery';

interface TriggerButtonProps {
  onSelectTrigger: (trigger: string) => void;
  buttonText?: string;
  tooltip?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const TriggerButton: React.FC<TriggerButtonProps> = ({
  onSelectTrigger,
  buttonText = "Mental Triggers",
  tooltip = "Add psychological triggers to improve ad performance",
  variant = 'outline',
  size = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectTrigger = (trigger: string) => {
    onSelectTrigger(trigger);
    setIsOpen(false);
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                e.stopPropagation(); // Stop propagation
                setIsOpen(true);
              }}
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
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelectTrigger={handleSelectTrigger}
      />
    </>
  );
};
