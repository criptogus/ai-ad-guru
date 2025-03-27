
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
  const { getTriggerDescription } = useTriggerData();
  
  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Current Selection</h3>
      {selectedTrigger ? (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-blue-800 dark:text-blue-300">
            {getTriggerDescription(platform, selectedTrigger)}
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
