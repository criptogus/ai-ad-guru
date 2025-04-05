
import { useState } from 'react';

export const useMentalTriggers = () => {
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);

  // Insert a trigger into a text field
  const insertTrigger = (
    trigger: string,
    fieldName: string,
    currentValue: string,
    updateFn: (fieldName: string, newValue: string) => void
  ) => {
    // Check if the field has a character limit
    const characterLimits: Record<string, number> = {
      headline1: 30,
      headline2: 30,
      headline3: 30,
      description1: 90,
      description2: 90
    };
    
    const limit = characterLimits[fieldName] || 0;
    
    // If the trigger would make the field exceed the limit, show warning and truncate
    if (limit && (currentValue.length + trigger.length) > limit) {
      console.warn(`Adding this trigger would exceed the ${limit} character limit. Truncating.`);
      const availableSpace = Math.max(0, limit - currentValue.length);
      const truncatedTrigger = trigger.substring(0, availableSpace);
      
      if (availableSpace <= 0) {
        console.error(`No space available to add the trigger to ${fieldName}`);
        return;
      }
      
      updateFn(fieldName, (currentValue + ' ' + truncatedTrigger).trim());
    } else {
      // Append the trigger to the current value with a space
      updateFn(fieldName, (currentValue + ' ' + trigger).trim());
    }
    
    setActiveTrigger(trigger);
  };
  
  // Replace the entire field with a trigger
  const replaceTrigger = (
    trigger: string,
    fieldName: string,
    updateFn: (fieldName: string, newValue: string) => void
  ) => {
    // Check if the field has a character limit
    const characterLimits: Record<string, number> = {
      headline1: 30,
      headline2: 30,
      headline3: 30,
      description1: 90,
      description2: 90
    };
    
    const limit = characterLimits[fieldName] || 0;
    
    // If the trigger exceeds the limit, truncate
    if (limit && trigger.length > limit) {
      console.warn(`Trigger exceeds ${limit} character limit. Truncating.`);
      updateFn(fieldName, trigger.substring(0, limit));
    } else {
      updateFn(fieldName, trigger);
    }
    
    setActiveTrigger(trigger);
  };
  
  return {
    activeTrigger,
    insertTrigger,
    replaceTrigger,
    setActiveTrigger
  };
};
