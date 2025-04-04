
// Utility functions for the analyze-audience edge function

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function createErrorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

export interface WebsiteData {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
  websiteUrl?: string;
  industry?: string;
  language?: string; // Added language property
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
  language?: string;
}
