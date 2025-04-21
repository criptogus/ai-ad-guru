
import React from "react";
import { Chrome, Linkedin, Instagram, Target } from "lucide-react";

export interface Trigger {
  id: string;
  name: string;
  description: string;
}

export const useTriggerData = () => {
  // Get platform icon component
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "google":
        return React.createElement(Chrome, { className: "h-4 w-4 text-red-500" });
      case "linkedin":
        return React.createElement(Linkedin, { className: "h-4 w-4 text-blue-700" });
      case "meta":
        return React.createElement(Instagram, { className: "h-4 w-4 text-pink-600" });
      case "microsoft":
        return React.createElement(Target, { className: "h-4 w-4 text-blue-500" });
      default:
        return null;
    }
  };

  // Get platform display name
  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "google":
        return "Google Ads";
      case "linkedin":
        return "LinkedIn Ads";
      case "meta":
        return "Instagram Ads";
      case "microsoft":
        return "Microsoft Ads";
      default:
        return platform;
    }
  };

  // Get trigger description for a given trigger ID
  const getTriggerDescription = (triggerId: string): string => {
    const triggers = getTriggers("google"); // Default to Google triggers
    const trigger = triggers.find(t => t.id === triggerId);
    
    if (trigger) {
      return `${trigger.name}: ${trigger.description}`;
    }
    
    // Handle custom triggers
    if (triggerId.startsWith('custom:')) {
      return triggerId.replace('custom:', '');
    }
    
    return "No description available";
  };

  // Get available triggers
  const getTriggers = (platform: string): Trigger[] => {
    // These are the psychological triggers we can use for ads
    const commonTriggers = [
      { id: "scarcity", name: "Scarcity", description: "Create a sense of limited availability" },
      { id: "urgency", name: "Urgency", description: "Create a sense of time pressure" },
      { id: "social_proof", name: "Social Proof", description: "Show that others have used and value the product" },
      { id: "authority", name: "Authority", description: "Leverage expertise and credibility" },
      { id: "reciprocity", name: "Reciprocity", description: "Offer something of value first" },
      { id: "curiosity", name: "Curiosity", description: "Create intrigue and questions in viewers' minds" },
      { id: "fear", name: "FOMO", description: "Create fear of missing out" },
      { id: "aspiration", name: "Aspiration", description: "Connect to people's ambitions and desires" }
    ];
    
    // Platform-specific triggers
    const platformTriggers: Record<string, Trigger[]> = {
      google: [
        ...commonTriggers,
        { id: "problem_solution", name: "Problem-Solution", description: "Present a clear problem and your solution" },
        { id: "benefit_focused", name: "Benefit Focused", description: "Focus heavily on customer benefits" }
      ],
      linkedin: [
        ...commonTriggers,
        { id: "professional_growth", name: "Professional Growth", description: "Appeal to career advancement" },
        { id: "industry_insight", name: "Industry Insight", description: "Position as thought leadership content" }
      ],
      meta: [
        ...commonTriggers,
        { id: "lifestyle", name: "Lifestyle Appeal", description: "Show how product enhances lifestyle" },
        { id: "emotional", name: "Emotional Connection", description: "Create strong emotional response" }
      ],
      microsoft: [
        ...commonTriggers,
        { id: "value_proposition", name: "Value Proposition", description: "Clear statement of value delivered" },
        { id: "comparison", name: "Comparison", description: "Favorable comparison to alternatives" }
      ]
    };
    
    return platformTriggers[platform] || commonTriggers;
  };

  // Get platform-specific triggers
  const getPlatformTriggers = (platform: string): Trigger[] => {
    return getTriggers(platform);
  };

  return {
    getPlatformIcon,
    getPlatformDisplayName,
    getTriggers,
    getTriggerDescription,
    getPlatformTriggers
  };
};
