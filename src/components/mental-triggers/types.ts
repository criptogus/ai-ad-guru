
export type TriggerCategory = 
  | "google_ad" 
  | "meta_ad" 
  | "linkedin_ad" 
  | "microsoft_ad" 
  | "all"
  | "urgency"
  | "social-proof"
  | "value-proposition"
  | "authority"
  | "curiosity"
  | "emotional";

export interface MentalTrigger {
  id: string;
  name: string;
  description: string;
  category: TriggerCategory;
  emoji: string;
  promptTemplate: string;
  examples: string[];
}

export interface TriggerCategoryInfo {
  id: TriggerCategory;
  name: string;
  description: string;
  icon: string;
  emoji: string; // Added emoji property to fix the errors
}
