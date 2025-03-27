
import React from 'react';
import { Button } from '@/components/ui/button';
import { MentalTrigger } from './types';

interface TriggerItemProps {
  trigger: MentalTrigger;
  onSelect: (e: React.MouseEvent, template: string) => void;
}

export const TriggerItem: React.FC<TriggerItemProps> = ({ trigger, onSelect }) => {
  const handleSelectClick = (e: React.MouseEvent) => {
    // Prevent default browser behavior and bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onSelect callback with the trigger template
    onSelect(e, trigger.promptTemplate);
  };
  
  return (
    <div className="border rounded-md p-3 bg-card hover:bg-accent/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">{trigger.name}</div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSelectClick}
          onMouseDown={(e) => e.preventDefault()}
          className="h-7 px-2"
        >
          Select
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{trigger.description}</p>
      {trigger.examples && trigger.examples.length > 0 && (
        <div className="mt-2 text-xs">
          <p className="text-muted-foreground mb-1">Examples:</p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80">
            {trigger.examples.slice(0, 1).map((example, idx) => (
              <li key={idx}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
