
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useAdGenerationFlow } from '@/hooks/useAdGenerationFlow';
import { CampaignPromptData } from '@/services/ads/adGeneration/types';
import { CampaignData } from '@/hooks/useCampaignState';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';
import { normalizeGoogleAd, normalizeMetaAd } from '@/lib/utils';
import { useCreditsManager } from '@/hooks/useCreditsManager';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdGenerationStepProps {
  analysisResult: any;
  campaignData: CampaignData;
  onAdsGenerated: (ads: Record<string, any[]>) => void;
  platforms: string[];
  onNext?: () => void;
}

export const AdGenerationStep: React.FC<AdGenerationStepProps> = ({
  analysisResult,
  campaignData,
  onAdsGenerated,
  platforms,
  onNext
}) => {
  const { generateCampaignAds, isGenerating } = useAdGenerationFlow();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { checkCreditBalance, consumeCredits } = useCreditsManager();
  const { currentLanguage } = useLanguage();

  const handleGenerateAds = async () => {
    if (!platforms || platforms.length === 0) {
      toast({
        title: "Nenhuma plataforma selecionada",
        description: "Selecione pelo menos uma plataforma antes de gerar anúncios."
      });
      return;
    }
    
    setError(null);
    
    const requiredCredits = platforms.length * 5;
    const hasEnough = await checkCreditBalance(requiredCredits);
    
    if (!hasEnough) {
      toast({
        title: "Créditos insuficientes",
        description: `Você precisa de ${requiredCredits} créditos para gerar anúncios para ${platforms.length} plataformas.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const results: Record<string, any[]> = {};
      let hasAnySuccessfulPlatform = false;

      const mindTriggers: Record<string, string> = {};
      platforms.forEach(platform => {
        mindTriggers[platform] = campaignData.mindTriggers?.[platform] || '';
      });

      // Determine which language to use (first from the analysis result, then from campaign data, then from context)
      const adLanguage = analysisResult?.language || campaignData.language || currentLanguage || 'pt';
      console.log(`Using language for ads: ${adLanguage}`);

      const promptData: CampaignPromptData = {
        companyName: campaignData.companyName || analysisResult?.companyName || campaignData.name || 'Your Company',
        websiteUrl: campaignData.targetUrl || campaignData.websiteUrl || analysisResult?.websiteUrl || '',
        objective: campaignData.objective || analysisResult?.objective || 'awareness',
        product: campaignData.product || analysisResult?.product || '',
        targetAudience: campaignData.targetAudience || analysisResult?.targetAudience || '',
        brandTone: campaignData.brandTone || analysisResult?.brandTone || 'professional',
        mindTrigger: campaignData.mindTriggers?.['default'] || '',
        mindTriggers: mindTriggers,
        language: adLanguage,
        industry: campaignData.industry || analysisResult?.industry || '',
        platforms: platforms,
        companyDescription: campaignData.description || analysisResult?.companyDescription || analysisResult?.businessDescription || '',
        differentials: analysisResult?.uniqueSellingPoints || [],
        callToAction: analysisResult?.callToAction || 'Saiba Mais',
        keywords: analysisResult?.keywords || []
      };

      toast({
        title: `Gerando anúncios para ${platforms.join(', ')}`,
        description: `Criando 5 variações de anúncios por plataforma (${requiredCredits} créditos).`
      });

      const creditConsumed = await consumeCredits(requiredCredits, "Ad generation");
      if (!creditConsumed) {
        toast({
          title: "Erro ao debitar créditos",
          description: "Não foi possível debitar os créditos necessários para esta operação.",
          variant: "destructive",
        });
        return;
      }

      try {
        const ads = await generateCampaignAds(promptData);
        
        if (ads) {
          platforms.forEach(platform => {
            if (platform === 'google' && ads.google_ads) {
              results[platform] = ads.google_ads.map(ad => normalizeGoogleAd(ad));
              hasAnySuccessfulPlatform = true;
            } else if ((platform === 'meta' || platform === 'instagram') && (ads.meta_ads || ads.instagram_ads)) {
              results[platform] = (ads.meta_ads || ads.instagram_ads || []).map(ad => normalizeMetaAd(ad));
              hasAnySuccessfulPlatform = true;
            } else if (platform === 'linkedin' && ads.linkedin_ads) {
              results[platform] = ads.linkedin_ads.map(ad => normalizeMetaAd(ad));
              hasAnySuccessfulPlatform = true;
            } else if (platform === 'microsoft' && ads.microsoft_ads) {
              results[platform] = ads.microsoft_ads.map(ad => normalizeGoogleAd(ad));
              hasAnySuccessfulPlatform = true;
            }
          });

          if (hasAnySuccessfulPlatform) {
            console.log("Generated ad results:", results);
            onAdsGenerated(results);
            toast({
              title: "Anúncios gerados com sucesso",
              description: `Foram criadas ${Object.values(results).flat().length} variações de anúncios.`
            });
            if (onNext) {
              onNext();
            }
          } else {
            setError("Nenhum anúncio foi gerado para as plataformas selecionadas.");
            toast({
              title: "Erro ao gerar anúncios",
              description: "Nenhum anúncio foi gerado para as plataformas selecionadas.",
              variant: "destructive",
            });
          }
        }
      } catch (err: any) {
        console.error("Error in ad generation:", err);
        setError(err?.message || "Erro ao gerar anúncios");
        toast({
          title: "Erro ao gerar anúncios",
          description: err?.message || "Ocorreu um erro durante a geração dos anúncios.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error in handling ad generation:", err);
      setError(err?.message || "Erro no processo de geração");
      toast({
        title: "Erro no processo",
        description: err?.message || "Ocorreu um erro durante o processo de geração dos anúncios.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Geração de Anúncios</h3>
        <p className="text-muted-foreground">
          Gere anúncios otimizados para todas as plataformas selecionadas.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na geração de anúncios</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Plataformas selecionadas</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {platforms.map(platform => (
                  <div key={platform} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                    {platform === 'google' && 'Google Ads'}
                    {platform === 'meta' && 'Meta Ads'}
                    {platform === 'linkedin' && 'LinkedIn Ads'}
                    {platform === 'microsoft' && 'Microsoft Ads'}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleGenerateAds}
                disabled={isGenerating || platforms.length === 0}
                size="lg"
                className="w-full md:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Anúncios...
                  </>
                ) : (
                  'Gerar Anúncios'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>
          *A geração de anúncios consumirá 5 créditos por plataforma.
          {platforms.length > 0 && ` Total de créditos para esta operação: ${platforms.length * 5}.`}
        </p>
      </div>
    </div>
  );
};

export default AdGenerationStep;
