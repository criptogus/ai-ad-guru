
import React from 'react';
import { useTriggerData } from './useTriggerData';
import TriggerCard from './TriggerCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const { getPlatformTriggers, getPlatformIcon } = useTriggerData();
  const triggers = getPlatformTriggers(platform);
  const icon = getPlatformIcon(platform);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="text-xl">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Choose the mental trigger that best aligns with this platform's audience and goals.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Choose the mental trigger that will guide your {title}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {triggers.map(trigger => (
          <TriggerCard
            key={trigger.id}
            trigger={trigger}
            isSelected={selected === trigger.id}
            onSelect={() => onSelect(trigger.id)}
          />
        ))}
      </div>
      
      {selected && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">Selected:</span> {triggers.find(t => t.id === selected)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default TriggerSelectorSection;
