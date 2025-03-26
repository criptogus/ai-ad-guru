
export interface MentalTrigger {
  id: string;
  name: string;
  description: string;
  category: TriggerCategory;
  examples: string[];
  promptTemplate: string;
}

export type TriggerCategory = 
  | 'urgency' 
  | 'social-proof' 
  | 'value-proposition' 
  | 'authority' 
  | 'curiosity' 
  | 'emotional';

export interface TriggerCategoryInfo {
  id: TriggerCategory;
  name: string;
  description: string;
  emoji: string;
  color: string;
}
