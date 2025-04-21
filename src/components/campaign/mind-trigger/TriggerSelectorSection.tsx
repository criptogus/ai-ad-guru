
import React from 'react';
import { useTriggerData } from './useTriggerData';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface TriggerSelectorSectionProps {
  title: string;
  platform: string;
  selected: string;
  onSelect: (triggerId: string) => void;
}

const TriggerSelectorSection: React.FC<TriggerSelectorSectionProps> = ({
  title,
  platform,
  selected,
  onSelect
}) => {
  const { getTriggers } = useTriggerData();
  const triggers = getTriggers(platform);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title} Mind Triggers</h3>
      <p className="text-sm text-muted-foreground">
        Select a psychological trigger to enhance your {title} ad copy.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {triggers.map((trigger) => (
          <Card 
            key={trigger.id}
            className={`cursor-pointer transition-all ${
              selected === trigger.id 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelect(trigger.id)}
          >
            <CardContent className="p-4 relative">
              {selected === trigger.id && (
                <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
              )}
              <h4 className="font-semibold">{trigger.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {trigger.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TriggerSelectorSection;
