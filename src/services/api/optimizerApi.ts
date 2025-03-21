
import { secureApi } from './secureApi';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration';

// Define types for optimizer requests
export type OptimizationGoal = 'increase_ctr' | 'increase_conversions' | 'reduce_cpa' | 'increase_engagement';

export interface OptimizationRequest {
  ads: GoogleAd[] | MetaAd[];
  platform: 'google' | 'meta' | 'linkedin' | 'microsoft';
  performance?: any;
  optimizationGoal?: OptimizationGoal;
}

// Define types for optimizer responses
export interface OptimizedGoogleAd {
  originalAdIndex: number;
  headlines: string[];
  descriptions: string[];
  rationale: string;
}

export interface OptimizedMetaAd {
  originalAdIndex: number;
  primaryText: string[];
  headline: string[];
  description: string[];
  imagePrompt?: string;
  rationale: string;
}

// Define an interface for the API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  original?: any;
}

/**
 * Generates AI-optimized ad variations based on existing ads and performance data
 * 
 * @param optimizationRequest - The request containing ads, platform, and optimization goals
 * @returns An array of optimized ad variations or null if optimization fails
 */
export async function optimizeAds<T>(
  optimizationRequest: OptimizationRequest
): Promise<T[] | null> {
  try {
    console.log('Optimizing ads with request:', optimizationRequest);
    
    const response = await secureApi.post<ApiResponse<T[]>>('/optimize-ads', 
      optimizationRequest, 
      { requiresAuth: true }
    );

    console.log('Ad optimization API response:', response);
    
    if (!response || !response.success || !response.data) {
      console.error('Failed to optimize ads:', response?.error || 'Unknown error');
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error optimizing ads:', error);
    return null;
  }
}
