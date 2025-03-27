
export type TriggerCategory = 
  | "google_ad" 
  | "meta_ad" 
  | "linkedin_ad" 
  | "microsoft_ad" 
  | "all";

export interface MentalTrigger {
  id: string;
  name: string;
  description: string;
  category: TriggerCategory;
  emoji: string; // Add emoji property
  promptTemplate: string;
}
