
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trigger } from './useTriggerData';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

interface TriggerCardProps {
  trigger: Trigger;
  isSelected: boolean;
  onSelect: () => void;
}

const TriggerCard: React.FC<TriggerCardProps> = ({ 
  trigger, 
  isSelected,
  onSelect 
}) => {
  return (
    <div className="relative">
      <RadioGroupItem
        value={trigger.id}
        id={`trigger-${trigger.id}`}
        className="peer sr-only"
        checked={isSelected}
        onChange={onSelect}
      />
      <Label
        htmlFor={`trigger-${trigger.id}`}
        className="flex flex-col h-full p-4 rounded-xl border border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
      >
        <span className="text-base font-medium mb-1">{trigger.name}</span>
        <span className="text-sm text-muted-foreground">{trigger.description}</span>
      </Label>
    </div>
  );
};

export default TriggerCard;
