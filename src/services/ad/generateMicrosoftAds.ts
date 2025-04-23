
import { callAdFunction } from "@/services/api/adClient";
import { normalizeGoogleAd } from "./normalize";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration/types";

export async function generateMicrosoftAds(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<GoogleAd[]> {
  const result = await callAdFunction("generate-ads", {
    platform: "microsoft",
    campaignData: {
      ...campaignData,
      language: campaignData.language || "portuguese",
      mindTriggers: { microsoft: mindTrigger }
    }
  });

  return result.map(normalizeGoogleAd);
}
