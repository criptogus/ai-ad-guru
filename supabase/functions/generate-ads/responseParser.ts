
import { GoogleAd, MetaAd } from "./types.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate fallback Google Ads that are contextually relevant and language consistent
export const generateFallbackGoogleAds = (campaignData: WebsiteAnalysisResult) => {
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
};

// Generate English fallback ads
function getEnglishFallbackAds(campaignData: any, companyName: string, shortDesc: string, usp: string) {
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

// Generate Portuguese fallback ads
function getPortugueseFallbackAds(campaignData: any, companyName: string, shortDesc: string, usp: string) {
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

// Generate Spanish fallback ads
function getSpanishFallbackAds(campaignData: any, companyName: string, shortDesc: string, usp: string) {
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

// Generate fallback Meta Ads with language consistency
export const generateFallbackMetaAds = (campaignData: WebsiteAnalysisResult) => {
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
};

// English Meta Ads fallbacks
function getEnglishFallbackMetaAds(campaignData: WebsiteAnalysisResult) {
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

// Portuguese Meta Ads fallbacks
function getPortugueseFallbackMetaAds(campaignData: WebsiteAnalysisResult) {
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

// Spanish Meta Ads fallbacks
function getSpanishFallbackMetaAds(campaignData: WebsiteAnalysisResult) {
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

// Language detection helper functions
function isEnglishText(text: string): boolean {
  if (!text) return true; // Default to English if empty
  
  // Common English words
  const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'you', 'it'];
  const lowerText = text.toLowerCase();
  
  return englishWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

function isPortugueseText(text: string): boolean {
  if (!text) return false;
  
  // Common Portuguese words
  const portugueseWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao'];
  const lowerText = text.toLowerCase();
  
  return portugueseWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

function isSpanishText(text: string): boolean {
  if (!text) return false;
  
  // Common Spanish words
  const spanishWords = ['de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'un', 'por', 'con', 'no', 'una', 'su', 'para', 'es', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'del', 'se', 'las'];
  const lowerText = text.toLowerCase();
  
  return spanishWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

// Parse OpenAI response into properly formatted ads
export const parseAdResponse = (generatedContent: string, platform: string, campaignData: WebsiteAnalysisResult) => {
  console.log(`OpenAI response for ${platform} ads:`, generatedContent);
  
  try {
    // Find JSON in the response
    const jsonMatch = generatedContent.match(/\[\s*{[\s\S]*}\s*\]/);
    let adData;
    
    if (jsonMatch) {
      adData = JSON.parse(jsonMatch[0]);
    } else {
      // If not found, try to parse the entire response as JSON
      try {
        adData = JSON.parse(generatedContent);
      } catch (error) {
        console.error(`Failed to parse OpenAI response as JSON for ${platform} ads:`, error.message);
        throw new Error('Invalid response format');
      }
    }
    
    // Handle both array and non-array responses
    if (!Array.isArray(adData)) {
      // If the response is not an array, check if it contains an array property
      const possibleArrayProperties = Object.values(adData).filter(value => Array.isArray(value));
      if (possibleArrayProperties.length > 0) {
        // Use the first array found
        adData = possibleArrayProperties[0];
      } else {
        console.error(`No array found in response for ${platform} ads:`, adData);
        throw new Error('No ad array found in response');
      }
    }
    
    // Validate and fix the ad content
    if (platform === 'google' && Array.isArray(adData)) {
      adData = adData.map((ad, index) => {
        // Store original headlines and descriptions for language analysis
        const origHeadlines = [...ad.headlines];
        const origDescriptions = [...ad.descriptions];
        
        // Check for language consistency in the ad
        const detectedLanguages = detectLanguagesInAdContent(ad);
        console.log(`Ad ${index + 1} detected languages:`, detectedLanguages);
        
        if (detectedLanguages.mixed) {
          console.log(`Mixed languages detected in ad ${index + 1}, attempting to fix`);
          ad = fixLanguageConsistency(ad, campaignData);
        }
        
        // Ensure at least one headline contains the company name
        const companyNameLower = campaignData.companyName.toLowerCase();
        const hasCompanyName = ad.headlines.some(headline => 
          headline.toLowerCase().includes(companyNameLower)
        );
        
        if (!hasCompanyName && ad.headlines.length > 0) {
          // Replace first headline with company name if missing
          ad.headlines[0] = campaignData.companyName;
        }
        
        // Log the changes made for debugging
        if (ad.headlines.some((h, i) => h !== origHeadlines[i]) || 
            ad.descriptions.some((d, i) => d !== origDescriptions[i])) {
          console.log(`Fixed ad ${index + 1}:`, {
            before: { headlines: origHeadlines, descriptions: origDescriptions },
            after: { headlines: ad.headlines, descriptions: ad.descriptions }
          });
        }
        
        return ad;
      });
    }
    
    // Final check to ensure we have desired number of ad variations
    if (!Array.isArray(adData) || adData.length === 0) {
      console.error(`Invalid ${platform} ad format received:`, adData);
      
      // Generate fallback ad variations if the response was invalid
      if (platform === 'google') {
        adData = generateFallbackGoogleAds(campaignData);
      } else if (platform === 'meta') {
        adData = generateFallbackMetaAds(campaignData);
      }
    } else if (platform === 'google' && adData.length < 5) {
      // Ensure we have at least 5 Google ad variations
      console.log(`Only ${adData.length} Google ad variations received, generating additional fallbacks`);
      const fallbacks = generateFallbackGoogleAds(campaignData);
      adData = [...adData, ...fallbacks.slice(0, 5 - adData.length)];
    } else if (platform === 'meta' && adData.length < 3) {
      // Ensure we have at least 3 Meta ad variations
      console.log(`Only ${adData.length} Meta ad variations received, generating additional fallbacks`);
      const fallbacks = generateFallbackMetaAds(campaignData);
      adData = [...adData, ...fallbacks.slice(0, 3 - adData.length)];
    }
    
    return adData;
  } catch (error) {
    console.error(`Failed to parse OpenAI response for ${platform} ads:`, error.message);
    
    // Return fallback ads on any parsing error
    if (platform === 'google') {
      return generateFallbackGoogleAds(campaignData);
    } else if (platform === 'meta') {
      return generateFallbackMetaAds(campaignData);
    } else {
      return [];
    }
  }
};

// Helper function to detect languages in an ad's content
function detectLanguagesInAdContent(ad: GoogleAd | MetaAd): { english: boolean, portuguese: boolean, spanish: boolean, mixed: boolean } {
  const allText = [];
  
  // Extract all text content from the ad based on its shape
  if ('headlines' in ad) {
    // Google ad
    allText.push(...ad.headlines, ...ad.descriptions);
  } else {
    // Meta ad
    allText.push(ad.primaryText, ad.headline, ad.description);
  }
  
  // Detect languages in each text piece
  const hasEnglish = allText.some(isEnglishText);
  const hasPortuguese = allText.some(isPortugueseText);
  const hasSpanish = allText.some(isSpanishText);
  
  // Determine if languages are mixed
  const mixed = (hasEnglish && (hasPortuguese || hasSpanish)) || 
               (hasPortuguese && (hasEnglish || hasSpanish)) || 
               (hasSpanish && (hasEnglish || hasPortuguese));
  
  return {
    english: hasEnglish,
    portuguese: hasPortuguese,
    spanish: hasSpanish,
    mixed
  };
}

// Helper function to fix language consistency in an ad
function fixLanguageConsistency(ad: GoogleAd, campaignData: WebsiteAnalysisResult): GoogleAd {
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
