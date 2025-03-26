
import { WebsiteAnalysisResult, LinkedInAd } from "../types.ts";
import { isEnglishText, isPortugueseText, isSpanishText } from "../utils/languageDetection.ts";

/**
 * Generates fallback LinkedIn Ads with language consistency
 */
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): LinkedInAd[] {
  // Detect language based on business description
  const isEnglish = isEnglishText(campaignData.businessDescription);
  const isPortuguese = isPortugueseText(campaignData.businessDescription);
  const isSpanish = isSpanishText(campaignData.businessDescription);
  
  if (isPortuguese) {
    return getPortugueseFallbackLinkedInAds(campaignData);
  } else if (isSpanish) {
    return getSpanishFallbackLinkedInAds(campaignData);
  } else {
    // Default to English or use original language
    return getEnglishFallbackLinkedInAds(campaignData);
  }
}

/**
 * English LinkedIn Ads fallbacks
 */
function getEnglishFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): LinkedInAd[] {
  return [
    {
      primaryText: `Are you looking to improve your ${campaignData.keywords?.[0] || 'business'}? ${campaignData.companyName} offers ${campaignData.uniqueSellingPoints?.[0] || 'high-quality services'} that will help you achieve your goals. ${campaignData.callToAction?.[0] || 'Contact us today!'}`,
      headline: "Take Your Business to the Next Level",
      description: "Professional Services",
      imagePrompt: `Professional LinkedIn advertisement for ${campaignData.companyName}, featuring a clean business setting with ${campaignData.brandTone || 'professional'} atmosphere.`
    },
    {
      primaryText: `Industry leaders trust ${campaignData.companyName} for ${campaignData.keywords?.[1] || 'innovative solutions'}. Our approach focuses on ${campaignData.uniqueSellingPoints?.[1] || 'customer satisfaction'} and delivering results that matter. ${campaignData.callToAction?.[0] || 'Learn more!'}`,
      headline: "Trusted by Industry Leaders",
      description: "See Why They Choose Us",
      imagePrompt: `Business networking event showing professionals discussing solutions, representing ${campaignData.companyName}'s industry leadership.`
    },
    {
      primaryText: `Join the growing number of businesses benefiting from our ${campaignData.keywords?.[0] || 'services'}. At ${campaignData.companyName}, we pride ourselves on ${campaignData.uniqueSellingPoints?.[2] || 'exceptional quality'} and commitment to your success.`,
      headline: "Join Our Success Story",
      description: "Results That Speak",
      imagePrompt: `Success-themed image for LinkedIn with upward trending graphs and business professionals celebrating achievements for ${campaignData.companyName}.`
    }
  ];
}

/**
 * Portuguese LinkedIn Ads fallbacks
 */
function getPortugueseFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): LinkedInAd[] {
  return [
    {
      primaryText: `Você está buscando melhorar seu ${campaignData.keywords?.[0] || 'negócio'}? ${campaignData.companyName} oferece ${campaignData.uniqueSellingPoints?.[0] || 'serviços de alta qualidade'} que irão ajudá-lo a alcançar seus objetivos. ${campaignData.callToAction?.[0] || 'Entre em contato hoje!'}`,
      headline: "Leve Seu Negócio ao Próximo Nível",
      description: "Serviços Profissionais",
      imagePrompt: `Anúncio profissional do LinkedIn para ${campaignData.companyName}, apresentando um ambiente de negócios limpo com atmosfera ${campaignData.brandTone || 'profissional'}.`
    },
    {
      primaryText: `Líderes do setor confiam na ${campaignData.companyName} para ${campaignData.keywords?.[1] || 'soluções inovadoras'}. Nossa abordagem se concentra em ${campaignData.uniqueSellingPoints?.[1] || 'satisfação do cliente'} e na entrega de resultados que importam. ${campaignData.callToAction?.[0] || 'Saiba mais!'}`,
      headline: "Confiado por Líderes do Mercado",
      description: "Veja Por Que Nos Escolhem",
      imagePrompt: `Evento de networking empresarial mostrando profissionais discutindo soluções, representando a liderança da ${campaignData.companyName} no setor.`
    },
    {
      primaryText: `Junte-se ao crescente número de empresas que se beneficiam dos nossos ${campaignData.keywords?.[0] || 'serviços'}. Na ${campaignData.companyName}, nos orgulhamos de ${campaignData.uniqueSellingPoints?.[2] || 'qualidade excepcional'} e compromisso com o seu sucesso.`,
      headline: "Junte-se à Nossa História de Sucesso",
      description: "Resultados Que Falam",
      imagePrompt: `Imagem com tema de sucesso para LinkedIn com gráficos em ascensão e profissionais de negócios celebrando conquistas para ${campaignData.companyName}.`
    }
  ];
}

/**
 * Spanish LinkedIn Ads fallbacks
 */
function getSpanishFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): LinkedInAd[] {
  return [
    {
      primaryText: `¿Estás buscando mejorar tu ${campaignData.keywords?.[0] || 'negocio'}? ${campaignData.companyName} ofrece ${campaignData.uniqueSellingPoints?.[0] || 'servicios de alta calidad'} que te ayudarán a alcanzar tus objetivos. ${campaignData.callToAction?.[0] || '¡Contáctanos hoy!'}`,
      headline: "Lleva Tu Negocio al Siguiente Nivel",
      description: "Servicios Profesionales",
      imagePrompt: `Anuncio profesional de LinkedIn para ${campaignData.companyName}, con un entorno empresarial limpio y una atmósfera ${campaignData.brandTone || 'profesional'}.`
    },
    {
      primaryText: `Los líderes de la industria confían en ${campaignData.companyName} para ${campaignData.keywords?.[1] || 'soluciones innovadoras'}. Nuestro enfoque se centra en ${campaignData.uniqueSellingPoints?.[1] || 'la satisfacción del cliente'} y en ofrecer resultados que importan. ${campaignData.callToAction?.[0] || '¡Aprende más!'}`,
      headline: "Confiado por Líderes de la Industria",
      description: "Descubre Por Qué Nos Eligen",
      imagePrompt: `Evento de networking empresarial que muestra a profesionales discutiendo soluciones, representando el liderazgo de ${campaignData.companyName} en la industria.`
    },
    {
      primaryText: `Únete al creciente número de empresas que se benefician de nuestros ${campaignData.keywords?.[0] || 'servicios'}. En ${campaignData.companyName}, nos enorgullecemos de ${campaignData.uniqueSellingPoints?.[2] || 'la calidad excepcional'} y del compromiso con tu éxito.`,
      headline: "Únete a Nuestra Historia de Éxito",
      description: "Resultados Que Hablan",
      imagePrompt: `Imagen con tema de éxito para LinkedIn con gráficos en tendencia ascendente y profesionales de negocios celebrando logros para ${campaignData.companyName}.`
    }
  ];
}
