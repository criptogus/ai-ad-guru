
import { useState, useEffect } from 'react';
import { TriggerCategory } from '@/components/mental-triggers/types';

// Re-export from useMentalTriggers for compatibility
import { useMentalTriggers } from '@/components/mental-triggers/useMentalTriggers';

export interface MindTrigger {
  id: string;
  title: string;
  description: string;
  examples: string[];
  category: TriggerCategory;
  text: string;
}

export const useMindTriggers = () => {
  const { triggers, selectedTrigger, setSelectedTrigger, categories } = useMentalTriggers();
  
  // Provide additional functionality for mind triggers specifically
  const [recentTriggers, setRecentTriggers] = useState<MindTrigger[]>([]);
  
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
  
  return {
    triggers,
    selectedTrigger,
    setSelectedTrigger,
    categories,
    recentTriggers
  };
};

export default useMindTriggers;
