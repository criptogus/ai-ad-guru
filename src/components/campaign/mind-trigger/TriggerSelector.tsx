
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTriggerData } from "./useTriggerData";

interface TriggerSelectorProps {
  platform: string;
  selectedTrigger: string;
  onSelectTrigger: (value: string) => void;
  onAddCustomTrigger: (value: string) => void;
}

const TriggerSelector: React.FC<TriggerSelectorProps> = ({
  platform,
  selectedTrigger,
  onSelectTrigger,
  onAddCustomTrigger
}) => {
  const [customTrigger, setCustomTrigger] = useState("");
  const { getPlatformTriggers } = useTriggerData();
  
  // Ensure trigger selection doesn't cause navigation
  const handleTriggerSelection = (value: string) => {
    // Only update state, never navigate
    onSelectTrigger(value);
  };
  
  // Handle custom trigger addition without navigation
  const handleAddCustom = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    
    if (customTrigger.trim()) {
      onAddCustomTrigger(customTrigger);
      setCustomTrigger("");
    }
  };
  
  return (
    <div>
      <h3 className="text-md font-medium mb-2">Select a Mind Trigger</h3>
      <Select 
        value={selectedTrigger.startsWith("custom:") ? "" : selectedTrigger} 
        onValueChange={handleTriggerSelection}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a psychological trigger" />
        </SelectTrigger>
        <SelectContent>
          {getPlatformTriggers(platform).map(trigger => (
            <SelectItem key={trigger.id} value={trigger.id}>
              {trigger.name} - {trigger.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Or create a custom trigger/prompt</h4>
        <div className="flex gap-2">
          <Input 
            value={customTrigger}
            onChange={(e) => setCustomTrigger(e.target.value)}
            placeholder="Enter a custom trigger or prompt instruction"
          />
          <Button 
            onClick={handleAddCustom} 
            type="button" 
            variant="secondary"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TriggerSelector;
