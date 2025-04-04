
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTriggerData } from './useTriggerData';
import { Label } from '@/components/ui/label';
import { SparklesIcon } from 'lucide-react';

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
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-semibold">
          <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
          {title} Mind Triggers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Select a psychological trigger to enhance your ad copy. Different platforms respond better to different psychological approaches.
        </p>
        
        <RadioGroup 
          value={selected} 
          onValueChange={onSelect}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {triggers.map((trigger) => (
            <div key={trigger.id} className="relative">
              <RadioGroupItem
                value={trigger.id}
                id={`trigger-${trigger.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`trigger-${trigger.id}`}
                className="flex flex-col h-full p-4 rounded-xl border border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <span className="text-base font-medium mb-1">{trigger.name}</span>
                <span className="text-sm text-muted-foreground">{trigger.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TriggerSelectorSection;
