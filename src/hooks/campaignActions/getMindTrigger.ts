
// Helper functions to retrieve mind triggers

/**
 * Get mind trigger for a specific platform
 */
export const getMindTrigger = (
  campaign: { mindTriggers?: Record<string, string> },
  platform: string
): string => {
  // If no mind triggers or platform not found, return empty string
  if (!campaign.mindTriggers || !campaign.mindTriggers[platform]) {
    return '';
  }

  // Extract the actual trigger text from custom triggers
  const trigger = campaign.mindTriggers[platform];
  
  // If it's a custom trigger (prefixed with custom:), extract the actual content
  if (trigger.startsWith('custom:')) {
    return trigger.substring(7); // Remove the 'custom:' prefix
  }
  
  return trigger;
};
