
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useAdGenerationFlow } from '@/hooks/useAdGenerationFlow';
import { CampaignPromptData } from '@/services/ads/adGeneration/types/promptTypes';
import { CampaignData } from '@/hooks/useCampaignState';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';
import { normalizeGoogleAd, normalizeMetaAd } from '@/lib/utils';

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

  const handleGenerateAds = async () => {
    if (!platforms || platforms.length === 0) {
      toast({
        title: "Nenhuma plataforma selecionada",
        description: "Selecione pelo menos uma plataforma antes de gerar anúncios."
      });
      return;
    }
    
    // Reset error state
    setError(null);
    
    try {
      const results: Record<string, any[]> = {};
      let hasAnySuccessfulPlatform = false;

      // Properly prepare mind triggers for all platforms
      const mindTriggers: Record<string, string> = {};
      platforms.forEach(platform => {
        mindTriggers[platform] = campaignData.mindTriggers?.[platform] || '';
      });

      // Generate ads for all selected platforms at once
      // Create a comprehensive prompt data object with all available context
      const promptData: CampaignPromptData = {
        companyName: campaignData.companyName || analysisResult?.companyName || campaignData.name || 'Your Company',
        websiteUrl: campaignData.targetUrl || campaignData.websiteUrl || analysisResult?.websiteUrl || '',
        objective: campaignData.objective || analysisResult?.objective || 'awareness',
        product: campaignData.product || analysisResult?.product || '',
        targetAudience: campaignData.targetAudience || analysisResult?.targetAudience || '',
        brandTone: campaignData.brandTone || analysisResult?.brandTone || 'professional',
        // Important: Pass the complete mindTriggers object for all platforms
        mindTriggers: mindTriggers,
        language: 'pt_BR', // Force Portuguese
        industry: campaignData.industry || analysisResult?.industry || '',
        platforms: platforms,
        companyDescription: campaignData.description || analysisResult?.companyDescription || analysisResult?.businessDescription || '',
        differentials: analysisResult?.uniqueSellingPoints || [],
        callToAction: analysisResult?.callToAction || 'Saiba Mais',
        keywords: analysisResult?.keywords || []
      };

      // Log full data being sent to prompt builder
      console.log('🧠 Sending unified prompt data:', JSON.stringify(promptData, null, 2));

      toast({
        title: `Gerando anúncios para ${platforms.join(', ')}`,
        description: `Criando 5 variações de anúncios por plataforma (${platforms.length * 5} créditos).`
      });

      try {
        // Send one request with all platforms
        const ads = await generateCampaignAds(promptData);
        
        if (ads) {
          // Process returned ads for each platform
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
            } else {
              console.warn(`No ${platform} ads data received`);
              // Create fallback ads if generation returns empty
              results[platform] = generateFallbackAds(platform, promptData);
              hasAnySuccessfulPlatform = true;
              
              toast({
                variant: "destructive",
                title: `Usando anúncios alternativos para ${platform}`,
                description: "Criamos anúncios padrão. Você pode editá-los na próxima etapa."
              });
            }
          });
        } else {
          console.warn(`No ads data received, using fallbacks`);
          // Create fallback ads for all platforms
          platforms.forEach(platform => {
            results[platform] = generateFallbackAds(platform, promptData);
          });
          hasAnySuccessfulPlatform = true;
          
          toast({
            variant: "destructive",
            title: `Usando anúncios alternativos`,
            description: "Criamos anúncios padrão. Você pode editá-los na próxima etapa."
          });
        }
        
        if (hasAnySuccessfulPlatform) {
          console.log("✅ Final generated ads: ", results);
          onAdsGenerated(results);
          toast({
            title: "Variações de anúncios geradas!",
            description: `Anúncios criados para: ${Object.keys(results).join(", ")}`
          });
          
          // Automatically move to the next step after successful generation
          if (onNext) {
            onNext();
          }
        } else {
          setError("Falha ao gerar anúncios para qualquer plataforma. Por favor, tente novamente.");
          toast({
            variant: "destructive",
            title: "Falha na geração de anúncios",
            description: "Não foi possível gerar anúncios. Verifique seus dados e tente novamente."
          });
        }
      } catch (error: any) {
        console.error(`❌ Failed to generate ads:`, error);
        // Create fallback ads on error for all platforms
        platforms.forEach(platform => {
          results[platform] = generateFallbackAds(platform, promptData);
        });
        
        if (Object.keys(results).length > 0) {
          onAdsGenerated(results);
          toast({
            variant: "destructive",
            title: `Usando anúncios alternativos`,
            description: "Criamos anúncios padrão. Você pode editá-los na próxima etapa."
          });
          
          // Still move to next step with fallback ads
          if (onNext) {
            onNext();
          }
        } else {
          setError(error instanceof Error ? error.message : "Ocorreu um erro inesperado");
          toast({
            variant: "destructive",
            title: "Falha na geração de anúncios",
            description: error instanceof Error ? error.message : "Algo deu errado. Tente novamente."
          });
        }
      }
    } catch (error: any) {
      console.error("❌ Failed to generate ads:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro inesperado");
      toast({
        variant: "destructive",
        title: "Falha na geração de anúncios",
        description: error instanceof Error ? error.message : "Algo deu errado. Tente novamente."
      });
    }
  };

  // Generate fallback ads when API fails
  const generateFallbackAds = (platform: string, promptData: CampaignPromptData) => {
    const companyName = promptData.companyName || 'Sua Empresa';
    const industry = promptData.industry || 'serviços profissionais';
    const targetAudience = promptData.targetAudience || 'clientes potenciais';
    const objective = promptData.objective || 'awareness';
    const description = promptData.companyDescription || `${companyName} fornece serviços de ${industry} de qualidade`;
    
    // Create complete sentences for descriptions
    const createCompleteDescription = (text: string, maxLength = 90) => {
      const truncated = text.substring(0, maxLength);
      return truncated.endsWith('.') ? truncated : truncated + '.';
    };
    
    // Get language-specific call to action
    const getCallToAction = () => {
      return objective === 'conversion' ? 'Compre Agora' : 
             objective === 'consideration' ? 'Saiba Mais' : 'Descubra Hoje';
    };
    
    // Get descriptive text
    const getServiceDescription = () => {
      return `Oferecemos ${industry} de alta qualidade para ${targetAudience}.`;
    };
    
    if (platform === 'google' || platform === 'microsoft') {
      const cta = getCallToAction();
      const serviceDesc = getServiceDescription();
      
      return Array(5).fill(null).map((_, i) => ({
        headline1: `${companyName} - ${industry}`,
        headline2: `${cta} ${i+1}`,
        headline3: cta,
        description1: createCompleteDescription(serviceDesc),
        description2: createCompleteDescription(description.substring(0, 80) || 
          `${companyName} é especialista em ${industry}, atendendo ${targetAudience} com excelência.`),
        displayPath: promptData.websiteUrl || 'exemplo.com.br',
        path1: 'servicos',
        path2: 'info',
        siteLinks: []
      }));
    } else if (platform === 'meta' || platform === 'linkedin') {
      const cta = getCallToAction();
      return Array(5).fill(null).map((_, i) => ({
        headline: `${companyName} - Especialistas em ${industry}`,
        primaryText: createCompleteDescription(
          `${description.substring(0, 100) || `${companyName} oferece soluções inovadoras de ${industry}.`} 
          Nossa equipe está pronta para ajudar ${targetAudience} a alcançar seus objetivos.`, 
          150
        ),
        description: createCompleteDescription(
          `Serviços de qualidade para ${targetAudience}. ${cta}!`, 
          80
        ),
        imagePrompt: `Imagem profissional de ${industry} para ${companyName}, mostrando pessoas representando ${targetAudience}, em um ambiente moderno com atmosfera ${promptData.brandTone || 'profissional'}`,
        format: 'feed'
      }));
    }
    
    return [];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Gerar Conteúdo de Anúncios</h3>
          <p className="text-muted-foreground">
            Usaremos IA para criar 5 variações de anúncios convincentes para cada plataforma selecionada, com base nos detalhes da sua campanha.
            Esta operação usará 5 créditos por plataforma da sua conta.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md bg-blue-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Informações de Geração de Anúncios</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Empresa: {campaignData.companyName || analysisResult?.companyName || campaignData.name}</p>
                  <p>Objetivo: {campaignData.objective || 'Não especificado'}</p>
                  <p>Plataformas:</p>
                  <ul className="list-disc ml-4 text-sm text-gray-700 dark:text-gray-300">
                    {platforms.map((platform) => (
                      <li key={platform}>
                        <strong>{platform}:</strong> Gatilho Mental: {campaignData.mindTriggers?.[platform] || 'Nenhum'}
                      </li>
                    ))}
                  </ul>
                  <p>Público-Alvo: {campaignData.targetAudience || analysisResult?.targetAudience || 'Não especificado'}</p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateAds} 
            disabled={isGenerating || platforms.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Anúncios...
              </>
            ) : (
              `Gerar Conteúdo de Anúncios (${platforms.length * 5} créditos)`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
