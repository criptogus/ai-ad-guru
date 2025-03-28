
// Define types for the tables we've created in the database
export interface CompanyInfo {
  id: string;
  user_id: string;
  company_name: string;
  website?: string;
  industry?: string;
  target_market?: string;
  language?: string;
  tone_of_voice?: string;
  custom_tone?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

// Helper methods for type checking
export const isCompanyInfo = (item: any): item is CompanyInfo => {
  return item && typeof item.company_name === 'string';
};
