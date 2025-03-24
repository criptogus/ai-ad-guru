
// Define types for the tables we've created in the database
export interface MediaAsset {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
  updated_at: string;
  campaigns: string[];
  metadata?: Record<string, any>;
  url?: string; // Used to store the public URL when fetched
}

export interface CopyAsset {
  id: string;
  user_id: string;
  text: string;
  platform: string;
  character_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  campaign_id?: string;
  ad_type?: string;
}

export interface CustomerData {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  segment?: string;
  created_at: string;
  updated_at: string;
  list_name?: string;
  import_batch?: string;
}

export interface CustomerImport {
  id: string;
  user_id: string;
  list_name: string;
  record_count: number;
  created_at: string;
  status: string;
}

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
export const isMediaAsset = (item: any): item is MediaAsset => {
  return item && typeof item.filename === 'string' && typeof item.file_path === 'string';
};

export const isCopyAsset = (item: any): item is CopyAsset => {
  return item && typeof item.text === 'string' && typeof item.platform === 'string';
};

export const isCustomerData = (item: any): item is CustomerData => {
  return item && typeof item.email === 'string';
};

export const isCompanyInfo = (item: any): item is CompanyInfo => {
  return item && typeof item.company_name === 'string';
};
