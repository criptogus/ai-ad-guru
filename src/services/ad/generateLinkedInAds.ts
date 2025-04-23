
import { callAdFunction } from "@/services/api/adClient";
import { normalizeMetaAd } from "./normalize";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration/types";

export async function generateLinkedInAds(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[]> {
  const result = await callAdFunction("generate-ads", {
    platform: "linkedin",
    campaignData: {
      ...campaignData,
      language: campaignData.language || "portuguese",
      mindTriggers: { linkedin: mindTrigger }
    }
  });

  return result.map(normalizeMetaAd);
}
