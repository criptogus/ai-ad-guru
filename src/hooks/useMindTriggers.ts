
import { useState, useEffect } from 'react';
import { TriggerCategory } from '@/components/mental-triggers/types';
// Import the default export from useMentalTriggers
import useMentalTriggers from '@/components/mental-triggers/useMentalTriggers';

export interface MindTrigger {
  id: string;
  title: string;
  description: string;
  examples: string[];
  category: TriggerCategory;
  text: string;
}

export const useMindTriggers = () => {
  // Get triggers from useMentalTriggers hook
  const mentalTriggersData = useMentalTriggers();
  
  // Provide additional functionality for mind triggers specifically
  const [recentTriggers, setRecentTriggers] = useState<MindTrigger[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<MindTrigger | null>(null);
  
  // Store recently used triggers
  useEffect(() => {
    if (selectedTrigger) {
      setRecentTriggers(prev => {
        // Remove if already exists
        const filtered = prev.filter(t => t.id !== selectedTrigger.id);
        // Add to beginning
        return [selectedTrigger, ...filtered].slice(0, 5);
      });
    }
  }, [selectedTrigger]);
  
  // Get all available triggers
  const getTriggers = () => {
    // Transform mental triggers into mind triggers format
    return mentalTriggersData.filteredTriggers.map(trigger => ({
      id: trigger.id || String(Math.random()),
      title: trigger.name,
      description: trigger.description,
      examples: trigger.examples || [],
      category: trigger.category,
      text: trigger.promptTemplate || trigger.name
    }));
  };
  
  // Insert a trigger into an ad's text field
  const insertTrigger = (
    trigger: string, 
    fieldName: string, 
    currentValue: string, 
    onUpdate: (fieldName: string, value: string) => void
  ) => {
    // If the text is already present, don't add it again
    if (currentValue.includes(trigger)) {
      return;
    }
    
    // Add the trigger with proper spacing
    const updatedValue = currentValue 
      ? (currentValue.endsWith('\n\n') || currentValue.endsWith(' ')) 
        ? `${currentValue}${trigger}` 
        : `${currentValue}\n\n${trigger}`
      : trigger;
    
    onUpdate(fieldName, updatedValue);
  };
  
  return {
    triggers: mentalTriggersData.filteredTriggers,
    categories: mentalTriggersData.categories,
    selectedTrigger,
    setSelectedTrigger,
    recentTriggers,
    getTriggers,
    insertTrigger
  };
};

export default useMindTriggers;
