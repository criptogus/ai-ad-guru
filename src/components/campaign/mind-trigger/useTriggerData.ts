
import { useCallback } from "react";

export const useTriggerData = () => {
  // Platform-specific template examples
  const templates = {
    google: [
      "Discover [Benefit] | [Unique Feature] | [Call to Action]",
      "[Problem]? Get [Solution] Today | [Timeframe] Results",
      "[Discount]% Off [Product] | Limited Time | [USP]",
      "Top-Rated [Product/Service] | [Social Proof] | [Guarantee]",
      "[Question]? | [USP] | [Call to Action]",
    ],
    meta: [
      "Transform your [pain point] with our [product] 🔥",
      "How [customer name] achieved [result] using [product] ✨",
      "The secret to [desired outcome] revealed! 👀",
      "NEW DROP: [Product name] - [key benefit] is here! 🚀",
      "Would you try this? [Unique feature/benefit] 👇",
    ],
    linkedin: [
      "New Report: [Industry] Trends That Will Shape [Year]",
      "How [Company] Increased [Metric] by [Percentage] in [Timeframe]",
      "[Number]+ Professionals Trust Our [Solution] for [Benefit]",
      "Join Us: [Job Title] | [Company Culture] | [Top Benefit]",
      "[Problem Statement]? Discover how [Solution] can help.",
    ],
    microsoft: [
      "Looking for [Solution]? | [USP] | [Guarantee]",
      "[Question about Pain Point]? | [Solution] | [Social Proof]",
      "[Location] [Service] | [USP] | Free [Bonus]",
      "Best [Product] for [Audience] | [Price/Value Prop] | [Timeframe]",
      "[Brand] Official Site | [Product] From $[Price] | Free Shipping",
    ],
  };

  const getPlatformTemplates = useCallback((platformId: string) => {
    return templates[platformId as keyof typeof templates] || templates.google;
  }, []);

  return {
    getPlatformTemplates,
  };
};
