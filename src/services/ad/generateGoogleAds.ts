
import { callAdFunction } from "@/services/api/adClient";
import { normalizeGoogleAd } from "./normalize";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration/types";

export async function generateGoogleAds(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<GoogleAd[]> {
  // Use generate-ads endpoint for Google ads to ensure proper context
  const result = await callAdFunction("generate-ads", {
    platform: "google",
    campaignData: {
      ...campaignData,
      language: campaignData.language || "portuguese",
      mindTriggers: { google: mindTrigger }
    }
  });

  return result.map(normalizeGoogleAd);
}
