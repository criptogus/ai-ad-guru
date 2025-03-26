
import React from "react";
import { useTriggerData } from "./useTriggerData";

interface CurrentSelectionDisplayProps {
  platform: string;
  selectedTrigger: string;
}

const CurrentSelectionDisplay: React.FC<CurrentSelectionDisplayProps> = ({ 
  platform, 
  selectedTrigger 
}) => {
  const { getPlatformTriggers } = useTriggerData();
  
  const formatTrigger = (trigger: string) => {
    if (!trigger) return "";
    
    // Handle custom triggers (prefixed with "custom:")
    if (trigger.startsWith("custom:")) {
      return trigger.substring(7); // Remove the "custom:" prefix
    }
    
    // Find the trigger in the platform's trigger list
    const triggerObj = getPlatformTriggers(platform).find(t => t.id === trigger);
    if (triggerObj) {
      return `${triggerObj.name} - ${triggerObj.description}`;
    }
    
    // Fallback: format the trigger ID (convert snake_case to Title Case)
    return trigger.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Current Selection</h3>
      {selectedTrigger ? (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300">
            {formatTrigger(selectedTrigger)}
          </p>
        </div>
      ) : (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-muted-foreground">No mind trigger selected for this platform yet</p>
        </div>
      )}
    </div>
  );
};

export default CurrentSelectionDisplay;
