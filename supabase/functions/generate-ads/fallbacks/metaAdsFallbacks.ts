
import { WebsiteAnalysisResult, MetaAd } from "../types.ts";
import { isEnglishText, isPortugueseText, isSpanishText } from "../utils/languageDetection.ts";

/**
 * Generates fallback Meta Ads with language consistency
 */
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  // Detect language based on business description
  const isEnglish = isEnglishText(campaignData.businessDescription);
  const isPortuguese = isPortugueseText(campaignData.businessDescription);
  const isSpanish = isSpanishText(campaignData.businessDescription);
  
  if (isPortuguese) {
    return getPortugueseFallbackMetaAds(campaignData);
  } else if (isSpanish) {
    return getSpanishFallbackMetaAds(campaignData);
  } else {
    // Default to English or use original language
    return getEnglishFallbackMetaAds(campaignData);
  }
}

/**
 * English Meta Ads fallbacks
 */
function getEnglishFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  return [
    {
      primaryText: `✨ Transform your experience with ${campaignData.companyName}! ${campaignData.uniqueSellingPoints[0] || 'High quality service'} ${campaignData.callToAction[0] || 'Contact us today!'}`,
      headline: "Discover the Difference",
      description: "Premium Quality",
      imagePrompt: `Professional advertisement for ${campaignData.companyName}, showing their services in action with a clean, modern aesthetic. ${campaignData.brandTone} style.`
    },
    {
      primaryText: `🚀 Ready for a change? ${campaignData.companyName} delivers results that matter! ${campaignData.uniqueSellingPoints[0] || 'Superior service'} ${campaignData.callToAction[0] || 'Get started now!'}`,
      headline: "Excellence Delivered",
      description: "See the Difference",
      imagePrompt: `Eye-catching advertisement showcasing ${campaignData.companyName}'s unique value proposition with vibrant colors and professional imagery. ${campaignData.brandTone} feel.`
    },
    {
      primaryText: `💯 Don't settle for less! ${campaignData.companyName} - where quality meets exceptional service. ${campaignData.callToAction[0] || 'Reach out today!'}`,
      headline: "The Smart Choice",
      description: "Join Satisfied Customers",
      imagePrompt: `High-quality advertisement featuring satisfied customers experiencing ${campaignData.companyName}'s services, with a ${campaignData.brandTone} atmosphere.`
    }
  ];
}

/**
 * Portuguese Meta Ads fallbacks
 */
function getPortugueseFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  return [
    {
      primaryText: `✨ Transforme sua experiência com ${campaignData.companyName}! ${campaignData.uniqueSellingPoints[0] || 'Serviço de alta qualidade'} ${campaignData.callToAction[0] || 'Entre em contato hoje!'}`,
      headline: "Descubra a Diferença",
      description: "Qualidade Premium",
      imagePrompt: `Anúncio profissional para ${campaignData.companyName}, mostrando seus serviços em ação com estética moderna e limpa. Estilo ${campaignData.brandTone}.`
    },
    {
      primaryText: `🚀 Pronto para uma mudança? ${campaignData.companyName} entrega resultados que importam! ${campaignData.uniqueSellingPoints[0] || 'Serviço superior'} ${campaignData.callToAction[0] || 'Comece agora!'}`,
      headline: "Excelência Entregue",
      description: "Veja a Diferença",
      imagePrompt: `Anúncio atraente destacando a proposta de valor única de ${campaignData.companyName} com cores vibrantes e imagens profissionais. Sensação ${campaignData.brandTone}.`
    },
    {
      primaryText: `💯 Não se contente com menos! ${campaignData.companyName} - onde qualidade encontra serviço excepcional. ${campaignData.callToAction[0] || 'Entre em contato hoje!'}`,
      headline: "A Escolha Inteligente",
      description: "Junte-se aos Clientes Satisfeitos",
      imagePrompt: `Anúncio de alta qualidade apresentando clientes satisfeitos experimentando os serviços de ${campaignData.companyName}, com uma atmosfera ${campaignData.brandTone}.`
    }
  ];
}

/**
 * Spanish Meta Ads fallbacks
 */
function getSpanishFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  return [
    {
      primaryText: `✨ ¡Transforma tu experiencia con ${campaignData.companyName}! ${campaignData.uniqueSellingPoints[0] || 'Servicio de alta calidad'} ${campaignData.callToAction[0] || '¡Contáctanos hoy!'}`,
      headline: "Descubre la Diferencia",
      description: "Calidad Premium",
      imagePrompt: `Anuncio profesional para ${campaignData.companyName}, mostrando sus servicios en acción con estética moderna y limpia. Estilo ${campaignData.brandTone}.`
    },
    {
      primaryText: `🚀 ¿Listo para un cambio? ${campaignData.companyName} ofrece resultados que importan! ${campaignData.uniqueSellingPoints[0] || 'Servicio superior'} ${campaignData.callToAction[0] || '¡Comienza ahora!'}`,
      headline: "Excelencia Entregada",
      description: "Ve la Diferencia",
      imagePrompt: `Anuncio atractivo que destaca la propuesta de valor única de ${campaignData.companyName} con colores vibrantes e imágenes profesionales. Sensación ${campaignData.brandTone}.`
    },
    {
      primaryText: `💯 ¡No te conformes con menos! ${campaignData.companyName} - donde la calidad se encuentra con un servicio excepcional. ${campaignData.callToAction[0] || '¡Contáctanos hoy!'}`,
      headline: "La Elección Inteligente",
      description: "Únete a los Clientes Satisfechos",
      imagePrompt: `Anuncio de alta calidad con clientes satisfechos experimentando los servicios de ${campaignData.companyName}, con una atmósfera ${campaignData.brandTone}.`
    }
  ];
}
