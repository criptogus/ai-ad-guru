
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export const defaultAd: MetaAd = {
  primaryText: "Discover how our B2B solution can transform your business operations. Our enterprise-grade platform is trusted by industry leaders to deliver measurable results.",
  headline: "Drive Business Growth with Our Enterprise Solution",
  description: "Book a consultation today",
  imagePrompt: "A professional team in a modern office environment discussing business strategy with data visualizations on screens",
  imageUrl: ""
};

export const defaultAnalysisResult: WebsiteAnalysisResult = {
  companyName: "Enterprise Solutions Inc.",
  businessDescription: "Enterprise-grade business solutions for modern companies",
  websiteUrl: "https://enterprise-solutions.example.com",
  brandTone: "Professional and authoritative",
  targetAudience: "B2B decision makers and enterprise-level businesses",
  uniqueSellingPoints: [
    "End-to-end business process automation",
    "Advanced analytics and reporting",
    "Enterprise-grade security and compliance"
  ],
  callToAction: ["Schedule a Demo", "Contact Sales"],
  keywords: ["enterprise", "B2B", "automation", "analytics", "business solutions"]
};
