
import { WebsiteAnalysisResult, GoogleAd } from "../types.ts";
import { 
  isEnglishText, 
  isPortugueseText, 
  isSpanishText 
} from "../utils/languageDetection.ts";

/**
 * Generates fallback Google Ads that are contextually relevant and language consistent
 */
export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult): GoogleAd[] {
  // Detect language based on business description
  const isEnglish = isEnglishText(campaignData.businessDescription);
  const isPortuguese = isPortugueseText(campaignData.businessDescription);
  const isSpanish = isSpanishText(campaignData.businessDescription);
  
  console.log("Detected language:", { isEnglish, isPortuguese, isSpanish });
  
  // Create company-specific fallback headlines with language matching
  const companyName = campaignData.companyName;
  const shortDesc = campaignData.businessDescription.split(' ').slice(0, 3).join(' ');
  const usp = campaignData.uniqueSellingPoints[0] || "";
  
  if (isPortuguese) {
    return getPortugueseFallbackAds(campaignData, companyName, shortDesc, usp);
  } else if (isSpanish) {
    return getSpanishFallbackAds(campaignData, companyName, shortDesc, usp);
  } else {
    // Default to English or use original language
    return getEnglishFallbackAds(campaignData, companyName, shortDesc, usp);
  }
}

/**
 * Generate English fallback ads
 */
function getEnglishFallbackAds(campaignData: any, companyName: string, shortDesc: string, usp: string): GoogleAd[] {
  return [
    {
      headlines: [
        `${companyName}`, 
        `Quality ${shortDesc}`, 
        "Get Started Today"
      ],
      descriptions: [
        `${campaignData.businessDescription.substring(0, 80)}...`,
        `${campaignData.callToAction[0] || 'Contact us'} Visit our website now.`
      ]
    },
    {
      headlines: [
        `Top ${shortDesc}`, 
        `${companyName}`, 
        "Learn More Now"
      ],
      descriptions: [
        `Top-rated services tailored to your needs. ${usp}`,
        `${campaignData.callToAction[0] || 'Learn more'} Don't wait.`
      ]
    },
    {
      headlines: [
        `Special ${shortDesc}`, 
        `Premium ${companyName}`, 
        "Limited Time Offer"
      ],
      descriptions: [
        `Discover how we can help you achieve your goals today.`,
        `${campaignData.callToAction[0] || 'Get started'} Learn more now.`
      ]
    },
    {
      headlines: [
        `${companyName}`, 
        `${usp || 'Professional Service'}`, 
        "Book Your Consultation"
      ],
      descriptions: [
        `We deliver exceptional results every time. Satisfaction guaranteed.`,
        `${campaignData.callToAction[0] || 'Explore'} See why clients love us.`
      ]
    },
    {
      headlines: [
        `${shortDesc} Experts`, 
        `Best at ${companyName}`, 
        "Act Now & Save"
      ],
      descriptions: [
        `Don't miss our special offer available for a limited time only.`,
        `${campaignData.callToAction[0] || 'Call now'} Offer ends soon.`
      ]
    }
  ];
}

/**
 * Generate Portuguese fallback ads
 */
function getPortugueseFallbackAds(campaignData: any, companyName: string, shortDesc: string, usp: string): GoogleAd[] {
  return [
    {
      headlines: [
        `${companyName}`, 
        `${shortDesc} de Qualidade`, 
        "Comece Hoje Mesmo"
      ],
      descriptions: [
        `${campaignData.businessDescription.substring(0, 80)}...`,
        `${campaignData.callToAction[0] || 'Entre em contato'} Visite nosso site.`
      ]
    },
    {
      headlines: [
        `Melhor ${shortDesc}`, 
        `${companyName}`, 
        "Saiba Mais Agora"
      ],
      descriptions: [
        `Serviços de alta qualidade adaptados às suas necessidades. ${usp}`,
        `${campaignData.callToAction[0] || 'Saiba mais'} Não espere.`
      ]
    },
    {
      headlines: [
        `${shortDesc} Especial`, 
        `${companyName} Premium`, 
        "Oferta por Tempo Limitado"
      ],
      descriptions: [
        `Descubra como podemos ajudar você a atingir seus objetivos hoje.`,
        `${campaignData.callToAction[0] || 'Comece agora'} Saiba mais.`
      ]
    },
    {
      headlines: [
        `${companyName}`, 
        `${usp || 'Serviço Profissional'}`, 
        "Agende Sua Consulta"
      ],
      descriptions: [
        `Oferecemos resultados excepcionais sempre. Satisfação garantida.`,
        `${campaignData.callToAction[0] || 'Explore'} Veja por que os clientes nos adoram.`
      ]
    },
    {
      headlines: [
        `Especialistas em ${shortDesc}`, 
        `${companyName} é o Melhor`, 
        "Aja Agora e Economize"
      ],
      descriptions: [
        `Não perca nossa oferta especial disponível por tempo limitado.`,
        `${campaignData.callToAction[0] || 'Ligue agora'} Oferta termina em breve.`
      ]
    }
  ];
}

/**
 * Generate Spanish fallback ads
 */
function getSpanishFallbackAds(campaignData: any, companyName: string, shortDesc: string, usp: string): GoogleAd[] {
  return [
    {
      headlines: [
        `${companyName}`, 
        `${shortDesc} de Calidad`, 
        "Comienza Hoy Mismo"
      ],
      descriptions: [
        `${campaignData.businessDescription.substring(0, 80)}...`,
        `${campaignData.callToAction[0] || 'Contáctanos'} Visita nuestro sitio web.`
      ]
    },
    {
      headlines: [
        `El Mejor ${shortDesc}`, 
        `${companyName}`, 
        "Más Información Aquí"
      ],
      descriptions: [
        `Servicios de alta calidad adaptados a tus necesidades. ${usp}`,
        `${campaignData.callToAction[0] || 'Más información'} No esperes.`
      ]
    },
    {
      headlines: [
        `${shortDesc} Especial`, 
        `${companyName} Premium`, 
        "Oferta por Tiempo Limitado"
      ],
      descriptions: [
        `Descubre cómo podemos ayudarte a lograr tus objetivos hoy.`,
        `${campaignData.callToAction[0] || 'Comienza ahora'} Más información.`
      ]
    },
    {
      headlines: [
        `${companyName}`, 
        `${usp || 'Servicio Profesional'}`, 
        "Agenda Tu Consulta"
      ],
      descriptions: [
        `Ofrecemos resultados excepcionales siempre. Satisfacción garantizada.`,
        `${campaignData.callToAction[0] || 'Explora'} ¿Por qué los clientes nos adoran?`
      ]
    },
    {
      headlines: [
        `Expertos en ${shortDesc}`, 
        `Lo Mejor de ${companyName}`, 
        "Actúa Ahora y Ahorra"
      ],
      descriptions: [
        `No te pierdas nuestra oferta especial disponible por tiempo limitado.`,
        `${campaignData.callToAction[0] || 'Llama ahora'} La oferta termina pronto.`
      ]
    }
  ];
}

/**
 * Fixes language consistency in a Google ad
 */
export function fixLanguageConsistency(ad: GoogleAd, campaignData: WebsiteAnalysisResult): GoogleAd {
  // Determine the predominant language from the company data
  const isPortuguese = isPortugueseText(campaignData.businessDescription);
  const isSpanish = isSpanishText(campaignData.businessDescription);
  
  // Get appropriate fallback based on detected language
  if (isPortuguese) {
    const fallbacks = getPortugueseFallbackAds(
      campaignData, 
      campaignData.companyName, 
      campaignData.businessDescription.split(' ').slice(0, 3).join(' '), 
      campaignData.uniqueSellingPoints[0] || ''
    );
    return fallbacks[0]; // Use first fallback
  } else if (isSpanish) {
    const fallbacks = getSpanishFallbackAds(
      campaignData, 
      campaignData.companyName, 
      campaignData.businessDescription.split(' ').slice(0, 3).join(' '), 
      campaignData.uniqueSellingPoints[0] || ''
    );
    return fallbacks[0]; // Use first fallback
  } else {
    const fallbacks = getEnglishFallbackAds(
      campaignData, 
      campaignData.companyName, 
      campaignData.businessDescription.split(' ').slice(0, 3).join(' '), 
      campaignData.uniqueSellingPoints[0] || ''
    );
    return fallbacks[0]; // Use first fallback
  }
}
