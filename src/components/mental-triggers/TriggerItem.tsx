
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MentalTrigger } from './types';
import { getCategoryInfo } from './triggerData';

interface TriggerItemProps {
  trigger: MentalTrigger;
  onSelect: () => void;
}

export const TriggerItem: React.FC<TriggerItemProps> = ({ trigger, onSelect }) => {
  const categoryInfo = getCategoryInfo(trigger.category);
  
  return (
    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2">
            {trigger.name}
          </h3>
          <Badge className={categoryInfo?.color || ""} variant="outline">
            {categoryInfo?.emoji} {categoryInfo?.name}
          </Badge>
        </div>
        <Button onClick={onSelect} size="sm">Use</Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-2 mb-3">{trigger.description}</p>
      
      <div className="mt-2">
        <h4 className="text-xs font-medium mb-1">Example Keywords:</h4>
        <div className="flex flex-wrap gap-1">
          {trigger.examples.map((example, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {example}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
