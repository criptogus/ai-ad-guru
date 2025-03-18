// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create standardized responses
export function handleResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

// Validate that a website analysis object has all required fields
export function validateAnalysisResult(analysis: any): boolean {
  const requiredFields = [
    'companyName', 
    'businessDescription', 
    'targetAudience', 
    'brandTone', 
    'keywords', 
    'callToAction', 
    'uniqueSellingPoints'
  ];
  
  for (const field of requiredFields) {
    if (!analysis[field]) {
      console.error(`Missing required field in analysis: ${field}`);
      return false;
    }
  }
  
  return true;
}

// Ensure all array fields are properly formatted as arrays
export function normalizeArrayFields(analysis: any): any {
  const arrayFields = ['keywords', 'callToAction', 'uniqueSellingPoints'];
  
  arrayFields.forEach(field => {
    if (!Array.isArray(analysis[field])) {
      console.log(`Converting ${field} to array`);
      if (typeof analysis[field] === 'string') {
        // If it's a string, try to split it
        analysis[field] = analysis[field].split(',').map((item: string) => item.trim());
      } else {
        // Otherwise create a default array
        analysis[field] = [`Default ${field} item`];
      }
    }
  });
  
  return analysis;
}
