
import { callAdFunction } from "@/services/api/adClient";
import { normalizeMetaAd } from "./normalize";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration/types";

export async function generateMetaAds(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[]> {
  const result = await callAdFunction("generate-premium-ads", {
    platform: "meta",
    campaignData: {
      ...campaignData,
      language: campaignData.language || "portuguese",
      mindTriggers: { meta: mindTrigger }
    }
  });

  return result.map(normalizeMetaAd);
}
