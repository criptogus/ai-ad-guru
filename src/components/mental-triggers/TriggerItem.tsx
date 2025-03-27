
import React, { MouseEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MentalTrigger } from './types';
import { Copy, Sparkles } from 'lucide-react';

interface TriggerItemProps {
  trigger: MentalTrigger;
  onSelect: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const TriggerItem: React.FC<TriggerItemProps> = ({ trigger, onSelect }) => {
  const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(trigger.promptTemplate);
  };
  
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{trigger.emoji}</span>
              <h3 className="font-medium">{trigger.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{trigger.description}</p>
            
            <div 
              className="text-sm border rounded-md p-2.5 bg-muted/50 line-clamp-2"
              style={{ maxHeight: "4.5rem", overflow: "hidden" }}
            >
              {trigger.promptTemplate}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-3 gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={handleCopy}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            Copy
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="text-xs"
            onClick={onSelect}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
