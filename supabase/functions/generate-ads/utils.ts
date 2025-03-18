
// CORS headers helper
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS response
export const handleCors = (includeContentType = false) => {
  const headers = { ...corsHeaders };
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Format campaign data for prompt
export const formatCampaignData = (campaignData) => {
  // Format keywords, CTAs, and USPs for better prompt formatting
  const keywords = Array.isArray(campaignData.keywords) 
    ? campaignData.keywords.join(", ") 
    : campaignData.keywords;
    
  const callToAction = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction.join(", ") 
    : campaignData.callToAction;
    
  const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints;

  return {
    keywords,
    callToAction,
    uniqueSellingPoints
  };
};
