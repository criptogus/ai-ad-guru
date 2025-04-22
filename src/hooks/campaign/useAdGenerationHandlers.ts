
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';
import { normalizeGoogleAd, normalizeMetaAd } from '@/lib/utils';

interface UseAdGenerationHandlersProps {
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<any[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<any[]>>;
  createCampaign: any;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>;
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (campaignData: any) => Promise<any[] | null>;
  generateMicrosoftAds: (campaignData: any) => Promise<any[] | null>;
}

export const useAdGenerationHandlers = ({
  analysisResult,
  campaignData,
  setGoogleAds,
  setMetaAds,
  setLinkedInAds,
  setMicrosoftAds,
  createCampaign,
  setIsCreating,
  generateGoogleAds,
  generateMetaAds,
  generateLinkedInAds,
  generateMicrosoftAds
}: UseAdGenerationHandlersProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // Detectar o idioma do conteúdo para gerar fallbacks contextualizados
  const detectLanguage = (): 'pt' | 'en' | 'es' => {
    const language = campaignData.language || analysisResult?.language || 'pt-BR';
    if (language.startsWith('pt')) return 'pt';
    if (language.startsWith('es')) return 'es';
    return 'en';
  };

  // Generate fallback Google ads com suporte a idiomas
  const generateFallbackGoogleAds = (): GoogleAd[] => {
    const language = detectLanguage();
    const companyName = campaignData.companyName || analysisResult?.companyName || 'Sua Empresa';
    const industry = campaignData.industry || analysisResult?.industry || '';
    const industryText = industry || (language === 'pt' ? 'serviços profissionais' : 
                                       language === 'es' ? 'servicios profesionales' : 
                                       'professional services');
    const targetAudience = campaignData.targetAudience || analysisResult?.targetAudience || '';
    const audienceText = targetAudience || (language === 'pt' ? 'clientes potenciais' : 
                                             language === 'es' ? 'clientes potenciales' : 
                                             'potential customers');
    
    // Textos localizados para fallbacks
    const headlines = {
      pt: {
        h1: `${companyName} - ${industryText}`,
        h2: `Soluções de Qualidade`,
        h3: `Entre em Contato Hoje`,
      },
      es: {
        h1: `${companyName} - ${industryText}`,
        h2: `Soluciones de Calidad`,
        h3: `Contáctenos Hoy`,
      },
      en: {
        h1: `${companyName} - ${industryText}`,
        h2: `Quality Solutions`,
        h3: `Contact Us Today`,
      }
    };
    
    const descriptions = {
      pt: {
        d1: `Oferecemos serviços de alta qualidade desenvolvidos para atender suas necessidades específicas no setor de ${industryText}.`,
        d2: `Saiba mais sobre como podemos ajudar seu negócio a crescer e ter sucesso. Soluções confiáveis para ${audienceText}.`,
      },
      es: {
        d1: `Ofrecemos servicios de alta calidad diseñados para satisfacer sus necesidades específicas en el sector de ${industryText}.`,
        d2: `Aprenda más sobre cómo podemos ayudar a su negocio a crecer y tener éxito. Soluciones confiables para ${audienceText}.`,
      },
      en: {
        d1: `We provide top-quality services designed for your specific requirements in the ${industryText} sector.`,
        d2: `Learn more about how we can help your business grow and succeed. Trusted solutions for ${audienceText}.`,
      }
    };
    
    return Array(5).fill(null).map((_, i) => ({
      headline1: headlines[language].h1,
      headline2: headlines[language].h2,
      headline3: headlines[language].h3,
      description1: descriptions[language].d1,
      description2: descriptions[language].d2,
      displayPath: campaignData.targetUrl || campaignData.websiteUrl || 'example.com',
      path1: language === 'pt' ? 'servicos' : language === 'es' ? 'servicios' : 'services',
      path2: language === 'pt' ? 'info' : 'info',
      siteLinks: []
    }));
  };
  
  // Generate fallback Meta/LinkedIn ads com suporte a idiomas
  const generateFallbackMetaAds = (): MetaAd[] => {
    const language = detectLanguage();
    const companyName = campaignData.companyName || analysisResult?.companyName || 'Sua Empresa';
    const industry = campaignData.industry || analysisResult?.industry || '';
    const industryText = industry || (language === 'pt' ? 'serviços profissionais' : 
                                       language === 'es' ? 'servicios profesionales' : 
                                       'professional services');
    const targetAudience = campaignData.targetAudience || analysisResult?.targetAudience || '';
    const audienceText = targetAudience || (language === 'pt' ? 'clientes potenciais' : 
                                             language === 'es' ? 'clientes potenciales' : 
                                             'potential customers');
    
    // Textos localizados para fallbacks
    const adTexts = {
      pt: {
        headline: `${companyName} - Soluções em ${industryText}`,
        primaryText: `Descubra como nossas soluções em ${industryText} podem transformar seu negócio. Nossa equipe de especialistas está pronta para ajudar ${audienceText} a alcançar seus objetivos.`,
        description: `Serviços de qualidade adaptados às suas necessidades. Entre em contato hoje para saber mais sobre nossas soluções confiáveis para ${audienceText}.`,
        imagePrompt: `Imagem profissional de negócios para ${companyName}, mostrando ambiente de ${industryText} com pessoas representando ${audienceText}, estilo de fotografia comercial de alta qualidade`
      },
      es: {
        headline: `${companyName} - Soluciones en ${industryText}`,
        primaryText: `Descubra cómo nuestras soluciones en ${industryText} pueden transformar su negocio. Nuestro equipo de expertos está listo para ayudar a ${audienceText} a alcanzar sus objetivos.`,
        description: `Servicios de calidad adaptados a sus necesidades. Contáctenos hoy para saber más sobre nuestras soluciones confiables para ${audienceText}.`,
        imagePrompt: `Imagen profesional de negocios para ${companyName}, mostrando ambiente de ${industryText} con personas representando ${audienceText}, estilo de fotografía comercial de alta calidad`
      },
      en: {
        headline: `${companyName} - ${industryText} Solutions`,
        primaryText: `Discover how our ${industryText} solutions can transform your business. Our team of experts is ready to help ${audienceText} achieve their goals.`,
        description: `Quality services tailored to your needs. Contact us today to learn more about our trusted solutions for ${audienceText}.`,
        imagePrompt: `Professional business image for ${companyName}, showing ${industryText} environment with people representing ${audienceText}, high quality commercial photography style`
      }
    };
    
    return Array(5).fill(null).map((_, i) => ({
      headline: adTexts[language].headline,
      primaryText: adTexts[language].primaryText,
      description: adTexts[language].description,
      imagePrompt: adTexts[language].imagePrompt,
      format: 'feed'
    }));
  };

  // Handler for all ads generated from AdGenerationStep component
  const handleAdsGenerated = (adsData: Record<string, any[]>) => {
    console.log("Handling generated ads:", adsData);
    
    // Process the ads by platform
    if (adsData.google && Array.isArray(adsData.google)) {
      setGoogleAds(adsData.google);
    }
    
    if (adsData.meta && Array.isArray(adsData.meta)) {
      setMetaAds(adsData.meta);
    }
    
    if (adsData.linkedin && Array.isArray(adsData.linkedin)) {
      setLinkedInAds(adsData.linkedin);
    }
    
    if (adsData.microsoft && Array.isArray(adsData.microsoft)) {
      setMicrosoftAds(adsData.microsoft);
    }
    
    toast({
      title: "Ad Generation Complete",
      description: `Ads generated for ${Object.keys(adsData).length} platforms.`
    });
  };

  // Individual platform ad generation handlers
  const handleGenerateGoogleAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Google Ads",
        description: "Creating 5 new ad variations"
      });
      
      const mindTrigger = campaignData.mindTriggers?.google || '';
      let ads = await generateGoogleAds({
        ...campaignData, 
        ...analysisResult,
        mindTrigger,
        platforms: ['google']
      });
      
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        ads = generateFallbackGoogleAds();
        toast({
          variant: "destructive",
          title: "Using fallback Google Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "Google Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      // Make sure the format is correct by mapping through normalizeGoogleAd
      const normalizedAds = Array.isArray(ads) ? ads.map(ad => normalizeGoogleAd(ad)) : [];
      setGoogleAds(normalizedAds);
    } catch (error) {
      console.error("Failed to generate Google Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackGoogleAds();
      setGoogleAds(fallbackAds);
      
      toast({
        variant: "destructive",
        title: "Using fallback Google Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Similar handlers for Meta, LinkedIn, and Microsoft ads
  const handleGenerateMetaAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Instagram Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.meta || '';
      let ads = await generateMetaAds({
        ...campaignData,
        ...analysisResult,
        mindTrigger,
        platforms: ['meta']
      });
  
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        ads = generateFallbackMetaAds();
        toast({
          variant: "destructive",
          title: "Using fallback Instagram Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "Instagram Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      // Make sure the format is correct by mapping through normalizeMetaAd
      const normalizedAds = Array.isArray(ads) ? ads.map(ad => normalizeMetaAd(ad)) : [];
      setMetaAds(normalizedAds);
    } catch (error) {
      console.error("Failed to generate Instagram Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackMetaAds();
      setMetaAds(fallbackAds);
      
      toast({
        variant: "destructive",
        title: "Using fallback Instagram Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating LinkedIn Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.linkedin || '';
      let ads = await generateLinkedInAds({
        ...campaignData,
        ...analysisResult,
        mindTrigger,
        platforms: ['linkedin']
      });
  
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        // Use the meta fallback generator as they share the same structure
        ads = generateFallbackMetaAds();
        toast({
          variant: "destructive",
          title: "Using fallback LinkedIn Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "LinkedIn Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      // Make sure the format is correct by mapping through normalizeMetaAd
      const normalizedAds = Array.isArray(ads) ? ads.map(ad => normalizeMetaAd(ad)) : [];
      setLinkedInAds(normalizedAds);
    } catch (error) {
      console.error("Failed to generate LinkedIn Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackMetaAds();
      setLinkedInAds(fallbackAds);
      
      toast({
        variant: "destructive",
        title: "Using fallback LinkedIn Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Microsoft Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.microsoft || '';
      let ads = await generateMicrosoftAds({
        ...campaignData,
        ...analysisResult,
        mindTrigger,
        platforms: ['microsoft']
      });
  
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        // Use the Google fallback generator as they share the same structure
        ads = generateFallbackGoogleAds();
        toast({
          variant: "destructive",
          title: "Using fallback Microsoft Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "Microsoft Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      // Make sure the format is correct by mapping through normalizeGoogleAd
      const normalizedAds = Array.isArray(ads) ? ads.map(ad => normalizeGoogleAd(ad)) : [];
      setMicrosoftAds(normalizedAds);
    } catch (error) {
      console.error("Failed to generate Microsoft Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackGoogleAds();
      setMicrosoftAds(fallbackAds);
      
      toast({
        variant: "destructive",
        title: "Using fallback Microsoft Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleAdsGenerated,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds,
    isGenerating
  };
};
