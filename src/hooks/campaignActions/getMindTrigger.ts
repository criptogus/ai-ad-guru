
/**
 * Utility to get the mind trigger for a platform from the campaign data
 * This is a centralized place to handle mind trigger extraction logic
 */
export const getMindTrigger = (campaignData: any, platform: string): string => {
  // Check if mindTriggers object exists
  if (!campaignData?.mindTriggers) {
    return "";
  }
  
  // Get the mind trigger for the specified platform
  const trigger = campaignData.mindTriggers[platform];
  
  // If the trigger starts with "custom:", extract the custom trigger text
  if (trigger && typeof trigger === 'string' && trigger.startsWith('custom:')) {
    return trigger.substring(7).trim(); // Remove "custom:" prefix
  }
  
  return trigger || "";
};
