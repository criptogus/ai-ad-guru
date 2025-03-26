
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useMentalTriggers() {
  const { toast } = useToast();
  const [loadingTriggerField, setLoadingTriggerField] = useState<string | null>(null);

  const insertTrigger = useCallback((trigger: string, fieldName: string, currentValue: string, setFieldValue: (field: string, value: string) => void) => {
    // If the field is empty, just insert the trigger
    if (!currentValue || currentValue.trim() === '') {
      setFieldValue(fieldName, trigger);
    } else {
      // If there's already text, insert the trigger at the cursor position or append it
      setFieldValue(fieldName, `${currentValue} ${trigger}`);
    }

    toast({
      title: "Trigger inserted",
      description: `"${trigger.substring(0, 30)}${trigger.length > 30 ? '...' : ''}" added to the ${fieldName} field`,
    });
  }, [toast]);

  return {
    insertTrigger,
    loadingTriggerField,
    setLoadingTriggerField
  };
}
