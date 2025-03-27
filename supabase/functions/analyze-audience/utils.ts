
// Utility functions for the analyze-audience edge function

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface WebsiteData {
  companyName?: string;
  businessDescription?: string;
  targetAudience?: string;
  brandTone?: string;
  keywords?: string[];
  callToAction?: string[];
  uniqueSellingPoints?: string[];
  websiteUrl?: string;
}

export interface AudienceAnalysisResult {
  success: boolean;
  platform: string;
  analysisText: string;
  demographics?: {
    ageGroups: string[];
    gender: string[];
    educationLevel: string[];
    incomeLevel: string[];
  };
  interests?: string[];
  painPoints?: string[];
  decisionFactors?: string[];
  fromCache?: boolean;
  cachedAt?: string;
}

// Helper function to handle error responses
export const createErrorResponse = (message: string, status = 500) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
};
