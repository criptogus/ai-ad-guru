
/**
 * Helper function to retrieve the mind trigger for a specific platform
 */
export const getMindTrigger = (
  campaignData: { mindTriggers?: Record<string, string> }, 
  platform: string
): string => {
  if (!campaignData.mindTriggers) {
    return '';
  }
  
  const trigger = campaignData.mindTriggers[platform];
  
  // Handle custom triggers (if they have a "custom:" prefix)
  if (trigger && trigger.startsWith('custom:')) {
    return trigger.substring(7); // Remove the "custom:" prefix
  }
  
  // Return the trigger or empty string if not found
  return trigger || '';
};
