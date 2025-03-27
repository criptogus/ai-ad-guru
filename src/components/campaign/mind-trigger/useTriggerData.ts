
import { useState, useEffect, useCallback } from "react";

// Define the data types
type TriggerItem = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  examples?: string[];
};

export const useTriggerData = () => {
  // Common mind triggers with icons
  const mindTriggers = {
    google: [
      { id: "urgency", name: "Urgency", description: "Create a sense of limited time or scarcity", icon: "⏰" },
      { id: "social_proof", name: "Social Proof", description: "Highlight popularity or testimonials", icon: "👥" },
      { id: "problem_solution", name: "Problem-Solution", description: "Present a problem, then offer your solution", icon: "🔍" },
      { id: "curiosity", name: "Curiosity", description: "Create intrigue with incomplete information", icon: "🧩" },
      { id: "comparison", name: "Comparison", description: "Compare your offering to alternatives", icon: "⚖️" },
      { id: "emotional", name: "Emotional Appeal", description: "Connect on an emotional level", icon: "❤️" },
    ],
    meta: [
      { id: "lifestyle", name: "Lifestyle Aspiration", description: "Show the desired lifestyle your product enables", icon: "✨" },
      { id: "before_after", name: "Before & After", description: "Demonstrate transformation and results", icon: "🔄" },
      { id: "user_generated", name: "User Generated Content", description: "Authentic content from real customers", icon: "👤" },
      { id: "storytelling", name: "Storytelling", description: "Narrative that connects emotionally", icon: "📖" },
      { id: "tutorial", name: "Tutorial/How-to", description: "Demonstrate product value through instruction", icon: "📝" },
      { id: "scarcity", name: "Scarcity", description: "Highlight limited quantity or exclusivity", icon: "🔥" },
    ],
    linkedin: [
      { id: "thought_leadership", name: "Thought Leadership", description: "Position as an industry expert", icon: "🏆" },
      { id: "data_insights", name: "Data & Insights", description: "Share valuable business intelligence", icon: "📊" },
      { id: "professional_growth", name: "Professional Growth", description: "Help advance careers or businesses", icon: "📈" },
      { id: "industry_trends", name: "Industry Trends", description: "Highlight emerging opportunities", icon: "🔮" },
      { id: "case_study", name: "Case Study", description: "Show real-world business results", icon: "🔎" },
      { id: "authority", name: "Authority", description: "Position as an expert or industry leader", icon: "👑" },
    ],
    microsoft: [
      { id: "specificity", name: "Specificity", description: "Use precise numbers and details", icon: "🔢" },
      { id: "authority", name: "Authority", description: "Establish expertise and credibility", icon: "🎯" },
      { id: "emotional", name: "Emotional Appeal", description: "Connect on an emotional level", icon: "💫" },
      { id: "question", name: "Question Format", description: "Pose a question to engage the reader", icon: "❓" },
      { id: "benefit_driven", name: "Benefit-Driven", description: "Focus on specific benefits to the user", icon: "💎" },
      { id: "professional", name: "Professional", description: "Corporate tone, trust, and credibility", icon: "💼" },
    ],
  };

  // Platform-specific template examples
  const templates = {
    google: [
      "Discover [Benefit] | [Unique Feature] | [Call to Action]",
      "[Problem]? Get [Solution] Today | [Timeframe] Results",
      "[Discount]% Off [Product] | Limited Time | [USP]",
    ],
    meta: [
      "Transform your [pain point] with our [product] 🔥",
      "How [customer name] achieved [result] using [product] ✨",
      "The secret to [desired outcome] revealed! 👀",
    ],
    linkedin: [
      "New Report: [Industry] Trends That Will Shape [Year]",
      "How [Company] Increased [Metric] by [Percentage] in [Timeframe]",
      "[Number]+ Professionals Trust Our [Solution] for [Benefit]",
    ],
    microsoft: [
      "Looking for [Solution]? | [USP] | [Guarantee]",
      "[Question about Pain Point]? | [Solution] | [Social Proof]",
      "[Location] [Service] | [USP] | Free [Bonus]",
    ],
  };

  // Icons for platforms
  const platformIcons = {
    google: "🔍",
    meta: "📱",
    linkedin: "📘",
    microsoft: "📌"
  };

  const getPlatformTriggers = useCallback((platformId: string): TriggerItem[] => {
    return mindTriggers[platformId as keyof typeof mindTriggers] || mindTriggers.google;
  }, []);

  const getPlatformTemplates = useCallback((platformId: string): string[] => {
    return templates[platformId as keyof typeof templates] || templates.google;
  }, []);

  // Add the missing getTriggerDescription function
  const getTriggerDescription = useCallback((platformId: string, triggerId: string): string => {
    if (!triggerId) return "";
    
    // Handle custom triggers (prefixed with "custom:")
    if (triggerId.startsWith("custom:")) {
      return triggerId.substring(7); // Remove the "custom:" prefix
    }
    
    // Find the trigger in the platform's trigger list
    const triggerObj = getPlatformTriggers(platformId).find(t => t.id === triggerId);
    if (triggerObj) {
      return triggerObj.description;
    }
    
    // Fallback: return the trigger ID
    return triggerId;
  }, [getPlatformTriggers]);

  // Helper function to get platform display name
  const getPlatformDisplayName = useCallback((platform: string): string => {
    switch (platform) {
      case 'google':
        return 'Google Ads';
      case 'meta':
        return 'Instagram/Meta Ads';
      case 'linkedin':
        return 'LinkedIn Ads';
      case 'microsoft':
        return 'Microsoft Ads';
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  }, []);

  // Helper function to get platform icon
  const getPlatformIcon = useCallback((platform: string): string => {
    return platformIcons[platform as keyof typeof platformIcons] || '🔍';
  }, []);

  return {
    getPlatformTriggers,
    getPlatformTemplates,
    getTriggerDescription,
    getPlatformDisplayName,
    getPlatformIcon
  };
};
