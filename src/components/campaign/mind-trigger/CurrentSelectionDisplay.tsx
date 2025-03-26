
import React from "react";
import { useTriggerData } from "./useTriggerData";
import { Badge } from "@/components/ui/badge";

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
    if (!trigger) return { name: "", description: "" };
    
    // Handle custom triggers (prefixed with "custom:")
    if (trigger.startsWith("custom:")) {
      return { 
        name: "Custom Template", 
        description: trigger.substring(7) // Remove the "custom:" prefix
      };
    }
    
    // Find the trigger in the platform's trigger list
    const triggerObj = getPlatformTriggers(platform).find(t => t.id === trigger);
    if (triggerObj) {
      return triggerObj;
    }
    
    // Fallback: format the trigger ID (convert snake_case to Title Case)
    return {
      name: trigger.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      description: ""
    };
  };

  const triggerObject = formatTrigger(selectedTrigger);

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Current Selection</h3>
      {selectedTrigger ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <Badge variant="secondary" className="mb-2">
            {triggerObject.name}
          </Badge>
          {triggerObject.description && (
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {triggerObject.description}
            </p>
          )}
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
