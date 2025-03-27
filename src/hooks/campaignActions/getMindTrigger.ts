
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
  
  // If no trigger found for platform, return empty string
  if (!trigger) {
    return "";
  }
  
  // If the trigger starts with "custom:", extract the custom trigger text
  if (typeof trigger === 'string' && trigger.startsWith('custom:')) {
    return trigger.substring(7).trim(); // Remove "custom:" prefix
  }
  
  // If it's a predefined trigger ID, convert it to a descriptive text
  // This matches the IDs from the MindTriggerSelectionStep component
  const triggerDescriptions: Record<string, string> = {
    // Google Ads triggers
    "authority": "Authority & Trust: Convey expertise and credibility",
    "scarcity": "Scarcity & Urgency: Create fear of missing out and prompt immediate action",
    "social": "Social Proof: Use testimonials and reviews to build trust",
    "curiosity": "Curiosity: Spark interest with intriguing questions or statements",
    "value": "Value Proposition: Clearly state the benefit to the customer",
    
    // Meta Ads triggers
    "emotion": "Emotional Appeal: Create an emotional connection with your audience",
    "storytelling": "Visual Storytelling: Tell a compelling story with visuals",
    "aspiration": "Aspiration: Show the ideal lifestyle your product enables",
    "before-after": "Before & After: Demonstrate transformation and results",
    "authenticity": "Authenticity: Show real people and genuine experiences",
    
    // LinkedIn Ads triggers
    "professional": "Professional Value: Focus on career advancement and professional growth",
    "industry": "Industry Insights: Share valuable industry knowledge and trends",
    "networking": "Networking Opportunity: Emphasize connection and relationship building",
    "expertise": "Thought Leadership: Position your brand as an industry leader",
    "roi": "Business ROI: Show concrete return on investment for businesses",
    
    // Microsoft Ads triggers
    "problem-solution": "Problem-Solution: Identify a pain point and present your solution",
    "competitive": "Competitive Edge: Highlight what makes you better than alternatives",
    "specific": "Specificity: Use precise numbers, facts, and details",
    "prestige": "Prestige: Associate with well-known brands or concepts",
    "future": "Future Value: Emphasize long-term benefits and results"
  };
  
  return triggerDescriptions[trigger] || trigger;
};
