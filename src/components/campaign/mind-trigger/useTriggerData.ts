
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

  // Common mind triggers
  const mindTriggers = {
    google: [
      { id: "urgency", name: "Urgency", description: "Create a sense of limited time or scarcity" },
      { id: "social_proof", name: "Social Proof", description: "Highlight popularity or testimonials" },
      { id: "problem_solution", name: "Problem-Solution", description: "Present a problem, then offer your solution" },
      { id: "curiosity", name: "Curiosity", description: "Create intrigue with incomplete information" },
      { id: "comparison", name: "Comparison", description: "Compare your offering to alternatives" },
    ],
    meta: [
      { id: "lifestyle", name: "Lifestyle Aspiration", description: "Show the desired lifestyle your product enables" },
      { id: "before_after", name: "Before & After", description: "Demonstrate transformation and results" },
      { id: "user_generated", name: "User Generated Content", description: "Authentic content from real customers" },
      { id: "storytelling", name: "Storytelling", description: "Narrative that connects emotionally" },
      { id: "tutorial", name: "Tutorial/How-to", description: "Demonstrate product value through instruction" },
    ],
    linkedin: [
      { id: "thought_leadership", name: "Thought Leadership", description: "Position as an industry expert" },
      { id: "data_insights", name: "Data & Insights", description: "Share valuable business intelligence" },
      { id: "professional_growth", name: "Professional Growth", description: "Help advance careers or businesses" },
      { id: "industry_trends", name: "Industry Trends", description: "Highlight emerging opportunities" },
      { id: "case_study", name: "Case Study", description: "Show real-world business results" },
    ],
    microsoft: [
      { id: "specificity", name: "Specificity", description: "Use precise numbers and details" },
      { id: "authority", name: "Authority", description: "Establish expertise and credibility" },
      { id: "emotional", name: "Emotional Appeal", description: "Connect on an emotional level" },
      { id: "question", name: "Question Format", description: "Pose a question to engage the reader" },
      { id: "benefit_driven", name: "Benefit-Driven", description: "Focus on specific benefits to the user" },
    ],
  };

  const getPlatformTemplates = useCallback((platformId: string) => {
    return templates[platformId as keyof typeof templates] || templates.google;
  }, []);

  const getPlatformTriggers = useCallback((platformId: string) => {
    return mindTriggers[platformId as keyof typeof mindTriggers] || mindTriggers.google;
  }, []);

  return {
    getPlatformTemplates,
    getPlatformTriggers
  };
};
