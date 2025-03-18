
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
  try {
    // Format keywords, CTAs, and USPs for better prompt formatting
    const keywords = Array.isArray(campaignData.keywords) 
      ? campaignData.keywords.join(", ") 
      : (typeof campaignData.keywords === 'string' ? campaignData.keywords : '');
      
    const callToAction = Array.isArray(campaignData.callToAction) 
      ? campaignData.callToAction.join(", ") 
      : (typeof campaignData.callToAction === 'string' ? campaignData.callToAction : '');
      
    const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) 
      ? campaignData.uniqueSellingPoints.join(", ") 
      : (typeof campaignData.uniqueSellingPoints === 'string' ? campaignData.uniqueSellingPoints : '');

    return {
      keywords,
      callToAction,
      uniqueSellingPoints
    };
  } catch (error) {
    console.error("Error formatting campaign data:", error);
    return {
      keywords: '',
      callToAction: '',
      uniqueSellingPoints: ''
    };
  }
};
