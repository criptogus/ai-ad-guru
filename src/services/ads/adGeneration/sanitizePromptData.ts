
import { CampaignPromptData } from "./types";

export function sanitizePromptData(data: CampaignPromptData): CampaignPromptData {
  return {
    companyName: data.companyName?.trim() || "Not provided",
    websiteUrl: data.websiteUrl?.trim() || "",
    product: data.product?.trim() || "",
    objective: data.objective?.trim() || "awareness",
    targetAudience: data.targetAudience?.trim() || "general audience",
    brandTone: data.brandTone?.trim() || "professional",
    industry: data.industry?.trim() || "general",
    language: data.language?.trim() || "english",
    companyDescription: data.companyDescription?.trim() || "",
    
    // Mind triggers
    mindTrigger: data.mindTrigger?.trim() || "",
    mindTriggers: data.mindTriggers || {},

    // Keywords
    keywords: Array.isArray(data.keywords)
      ? data.keywords.map(k => k.trim())
      : typeof data.keywords === "string"
        ? data.keywords.split(",").map(k => k.trim())
        : [],

    // Unique Selling Points
    differentials: Array.isArray(data.differentials)
      ? data.differentials.map(d => d.trim())
      : typeof data.differentials === "string"
        ? data.differentials.split(",").map(d => d.trim())
        : [],

    // Call to action
    callToAction: Array.isArray(data.callToAction)
      ? data.callToAction.map(c => c.trim())
      : typeof data.callToAction === "string"
        ? [data.callToAction.trim()]
        : ["Learn More"],

    // Platforms
    platforms: Array.isArray(data.platforms) && data.platforms.length > 0
      ? data.platforms
      : ["google"] // fallback default
  };
}
