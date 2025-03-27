
import React from "react";
import { Button } from "@/components/ui/button";

interface TriggerGalleryProps {
  triggers: string[];
  activeTrigger: string | undefined;
  onSelectTrigger: (trigger: string) => void;
  triggerIcons: Record<string, React.ReactNode>;
}

const TriggerGallery: React.FC<TriggerGalleryProps> = ({
  triggers,
  activeTrigger,
  onSelectTrigger,
  triggerIcons
}) => {
  const getTriggerDisplayName = (trigger: string): string => {
    return trigger
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {triggers.map((trigger) => (
        <Button
          key={trigger}
          variant={activeTrigger === trigger ? "default" : "outline"}
          className={`justify-start text-sm h-auto py-2 px-3 ${
            activeTrigger === trigger 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
          }`}
          onClick={() => onSelectTrigger(trigger)}
        >
          <div className="flex items-center">
            <span className="mr-2">{triggerIcons[trigger] || <span className="h-4 w-4" />}</span>
            <span>
              {getTriggerDisplayName(trigger)}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default TriggerGallery;
