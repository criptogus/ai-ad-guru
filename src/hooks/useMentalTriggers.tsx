
import { useState } from 'react';
import { triggerCategories, mentalTriggers } from '@/components/mental-triggers/triggerData';
import { TriggerCategory, MentalTrigger } from '@/components/mental-triggers/types';

export const useMentalTriggers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TriggerCategory | null>(null);

  const categories = triggerCategories;

  // Filter triggers based on search query and selected category
  const filteredTriggers = mentalTriggers.filter((trigger) => {
    const matchesSearch = 
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.promptTemplate.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || trigger.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Insert a trigger into a text field
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
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredTriggers,
    insertTrigger
  };
};

export default useMentalTriggers;
