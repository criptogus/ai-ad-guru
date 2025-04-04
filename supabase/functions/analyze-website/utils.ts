
// Utility functions for the analyze-website edge function

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
};

// Validates if the analysis result has all required fields
export function validateAnalysisResult(result: any) {
  const requiredFields = [
    'companyName',
    'businessDescription',
    'targetAudience',
    'brandTone',
    'keywords',
    'callToAction',
    'uniqueSellingPoints'
  ];
  
  return requiredFields.every(field => {
    if (Array.isArray(result[field])) {
      return Array.isArray(result[field]) && result[field].length > 0;
    }
    return result[field] !== undefined && result[field] !== null && result[field] !== '';
  });
}

// Normalizes array fields to ensure they're always arrays
export function normalizeArrayFields(result: any) {
  const arrayFields = ['keywords', 'callToAction', 'uniqueSellingPoints'];
  
  const normalized = { ...result };
  
  arrayFields.forEach(field => {
    if (!Array.isArray(normalized[field])) {
      // If it's a string, try to split by commas or convert to array
      if (typeof normalized[field] === 'string') {
        normalized[field] = normalized[field].split(',').map((item: string) => item.trim());
      } else {
        normalized[field] = normalized[field] ? [normalized[field]] : [];
      }
    }
  });
  
  return normalized;
}
