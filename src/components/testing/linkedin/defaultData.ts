
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export const defaultAd: MetaAd = {
  headline: "Transform Your Business with Our Solutions",
  primaryText: "Looking to optimize your business processes and increase productivity? Our proven solutions have helped hundreds of companies achieve their goals and grow their business.",
  description: "Schedule a demo today and see how we can help your team succeed.",
  imagePrompt: "A professional team working together in a modern office environment",
  imageUrl: ""
};

export const defaultAnalysisResult: WebsiteAnalysisResult = {
  companyName: "Your Business",
  businessDescription: "A professional company offering innovative solutions",
  websiteUrl: "https://yourbusiness.com",
  brandTone: "Professional",
  targetAudience: "Business professionals and decision makers",
  uniqueSellingPoints: ["Professional services", "Innovative solutions", "Expert team"],
  callToAction: ["Learn More"],
  keywords: ["business", "professional", "solutions"]
};
