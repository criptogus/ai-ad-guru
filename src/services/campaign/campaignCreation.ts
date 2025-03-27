
/**
 * Campaign Creation Service
 * Handles the creation of new advertising campaigns
 */

import { errorLogger } from '@/services/libs/error-handling';

export interface CampaignCreationParams {
  name: string;
  description: string;
  platforms: string[];
  budget: number;
  budgetType: 'daily' | 'lifetime';
  startDate: string;
  endDate?: string;
  targetAudience: string;
  objective: string;
  ads: {
    google?: any[];
    meta?: any[];
    linkedin?: any[];
    microsoft?: any[];
  };
  websiteUrl: string;
  mindTriggers?: Record<string, string>;
  userId: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  budget: number;
  budgetType: 'daily' | 'lifetime';
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new campaign
 */
export const createCampaign = async (params: CampaignCreationParams): Promise<Campaign | null> => {
  try {
    // This is a placeholder for actual campaign creation logic
    console.log('Creating campaign with params', params);
    
    // Return placeholder campaign
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: params.name,
      description: params.description,
      platforms: params.platforms,
      budget: params.budget,
      budgetType: params.budgetType,
      startDate: params.startDate,
      endDate: params.endDate,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    errorLogger.logError(error, 'createCampaign');
    return null;
  }
};

/**
 * Validate campaign parameters
 */
export const validateCampaignParams = (params: Partial<CampaignCreationParams>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required fields
  if (!params.name) {
    errors.push('Campaign name is required');
  }
  
  if (!params.platforms || params.platforms.length === 0) {
    errors.push('At least one platform must be selected');
  }
  
  if (!params.budget || params.budget <= 0) {
    errors.push('Budget must be greater than zero');
  }
  
  if (!params.startDate) {
    errors.push('Start date is required');
  }
  
  // Check if at least one ad is provided
  const hasAds = params.ads && (
    (params.ads.google && params.ads.google.length > 0) ||
    (params.ads.meta && params.ads.meta.length > 0) ||
    (params.ads.linkedin && params.ads.linkedin.length > 0) ||
    (params.ads.microsoft && params.ads.microsoft.length > 0)
  );
  
  if (!hasAds) {
    errors.push('At least one ad must be provided');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
