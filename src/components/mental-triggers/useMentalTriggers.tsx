
import { useState } from 'react';
import { mentalTriggers, triggerCategories, getTriggersByCategory } from './triggerData';
import { MentalTrigger, TriggerCategory } from './types';

const useMentalTriggers = () => {
  const [selectedCategory, setSelectedCategory] = useState<TriggerCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTriggers = searchQuery
    ? mentalTriggers.filter(trigger => 
        trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trigger.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trigger.examples && trigger.examples.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : selectedCategory 
      ? getTriggersByCategory(selectedCategory)
      : mentalTriggers;
  
  const getPromptForPlatform = (trigger: MentalTrigger, platform: string, productService: string): string => {
    return trigger.promptTemplate
      .replace('[PLATFORM]', platform)
      .replace('[PRODUCT/SERVICE]', productService);
  };
  
  return {
    triggers: mentalTriggers,
    categories: triggerCategories,
    filteredTriggers,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    getPromptForPlatform
  };
};

export default useMentalTriggers;
