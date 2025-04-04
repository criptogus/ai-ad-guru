
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export interface WebsiteData {
  companyName?: string;
  businessDescription?: string;
  targetAudience?: string;
  brandTone?: string;
  keywords?: string[];
  callToAction?: string[];
  uniqueSellingPoints?: string[];
  keySellingPoints?: string[]; // Alternative field
  usps?: string[]; // Another alternative field
  websiteUrl?: string;
  language?: string;
}

export const createErrorResponse = (message: string, status: number = 400) => {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status, 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
};
