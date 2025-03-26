
import { useState, useCallback } from "react";

// Types for platform triggers
interface TriggerItem {
  id: string;
  name: string;
  description: string;
  category?: string;
}

// Example platform triggers - these would typically come from an API or static data
const platformTriggers = {
  google: [
    { id: "social_proof", name: "Social Proof", description: "Show that others are using and enjoying your product" },
    { id: "scarcity", name: "Scarcity", description: "Indicate limited availability to increase perceived value" },
    { id: "urgency", name: "Urgency", description: "Create time pressure to drive immediate action" },
    { id: "authority", name: "Authority", description: "Leverage expertise or credentials to build trust" },
    { id: "reciprocity", name: "Reciprocity", description: "Offer something valuable to encourage action in return" }
  ],
  meta: [
    { id: "user_generated", name: "User Generated Content", description: "Showcase authentic content from real users" },
    { id: "before_after", name: "Before & After", description: "Demonstrate transformation or improvement" },
    { id: "how_to", name: "How-To / Tutorial", description: "Provide educational value and establish expertise" },
    { id: "behind_scenes", name: "Behind the Scenes", description: "Create connection by showing the human side of your brand" },
    { id: "storytelling", name: "Storytelling", description: "Create emotional connection through narrative" }
  ],
  linkedin: [
    { id: "professional_growth", name: "Professional Growth", description: "Focus on career advancement or skill development" },
    { id: "industry_insights", name: "Industry Insights", description: "Share valuable market data or trends" },
    { id: "testimonials", name: "Testimonials", description: "Showcase success stories from professionals" },
    { id: "thought_leadership", name: "Thought Leadership", description: "Position your brand as an industry authority" },
    { id: "networking", name: "Networking", description: "Highlight connection and community building" }
  ],
  microsoft: [
    { id: "benefit_focused", name: "Benefit Focused", description: "Emphasize specific outcomes and advantages" },
    { id: "rational_appeal", name: "Rational Appeal", description: "Use logic and facts to drive decision making" },
    { id: "problem_solution", name: "Problem-Solution", description: "Address a pain point and offer your solution" },
    { id: "comparison", name: "Comparison", description: "Highlight advantages over alternatives" },
    { id: "statistics", name: "Statistics", description: "Use data points to build credibility" }
  ]
};

// Example platform templates
const platformTemplates = {
  google: [
    "Get [Specific Benefit] with our [Product/Service] - [Unique Feature]",
    "Looking for [Solution]? Try [Product/Service] - [USP]",
    "[X]% Results for [Customer Type] - [Call to Action] Today"
  ],
  meta: [
    "Transform your [area] with our [product] - Join [X] satisfied customers",
    "Introducing: [Product] - How it's changing the way people [activity]",
    "The secret to [desired outcome]: [Your solution] - Learn how"
  ],
  linkedin: [
    "Boost your [professional skill] by [percentage] - New [training/tool] available",
    "[Industry] professionals trust [Product] for [benefit] - Here's why",
    "Join [X] industry leaders using [Product] to [solve challenge]"
  ],
  microsoft: [
    "Reduce [pain point] costs by [percentage] with [Product]",
    "[Product]: Rated #1 for [category] by [authority]",
    "Why [customer segment] choose [Product] for [use case]"
  ]
};

export const useTriggerData = () => {
  const getPlatformTriggers = useCallback((platformId: string): TriggerItem[] => {
    return platformTriggers[platformId as keyof typeof platformTriggers] || [];
  }, []);

  const getPlatformTemplates = useCallback((platformId: string): string[] => {
    return platformTemplates[platformId as keyof typeof platformTemplates] || [];
  }, []);

  return {
    getPlatformTriggers,
    getPlatformTemplates
  };
};
