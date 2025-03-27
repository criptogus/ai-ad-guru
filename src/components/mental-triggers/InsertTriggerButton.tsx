
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import TriggerGallery from './TriggerGallery';

interface InsertTriggerButtonProps {
  onSelectTrigger: (trigger: string) => void;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const InsertTriggerButton: React.FC<InsertTriggerButtonProps> = ({
  onSelectTrigger,
  buttonVariant = 'default',
  buttonSize = 'default',
  className = '',
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={className}
        onClick={(e) => {
          e.preventDefault(); // Prevent default behavior
          e.stopPropagation(); // Stop propagation
          setIsOpen(true);
        }}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {children || "Mental Triggers"}
      </Button>
      
      <TriggerGallery 
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelectTrigger={(trigger) => {
          onSelectTrigger(trigger);
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default InsertTriggerButton;
