
import { useState, useCallback } from "react";

interface MentalTriggerHookReturn {
  insertTrigger: (
    trigger: string,
    field: string,
    currentValue: string,
    updateHandler: (field: string, value: string) => void
  ) => void;
  selectedTrigger: string | null;
  setSelectedTrigger: (trigger: string | null) => void;
}

/**
 * A hook to manage the insertion of mental triggers into ad text
 */
export function useMentalTriggers(): MentalTriggerHookReturn {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const insertTrigger = useCallback(
    (
      trigger: string,
      field: string,
      currentValue: string,
      updateHandler: (field: string, value: string) => void
    ) => {
      // Check if trigger should replace or append to the current value
      const shouldReplace = currentValue.trim() === "";
      let newValue = shouldReplace ? trigger : `${currentValue} ${trigger}`;

      // Apply character limits based on field type
      const limit = field.startsWith("headline") ? 30 : 90;
      if (newValue.length > limit) {
        // If it exceeds limit, try to just use the trigger
        if (trigger.length <= limit) {
          newValue = trigger;
        } else {
          // If trigger itself is too long, truncate it
          newValue = trigger.substring(0, limit);
        }
      }

      // Update the field with the new value
      updateHandler(field, newValue);
      setSelectedTrigger(trigger);
    },
    []
  );

  return {
    insertTrigger,
    selectedTrigger,
    setSelectedTrigger,
  };
}
