
import { WebsiteAnalysisResult } from "./types.ts";
import { GoogleAd, MetaAd, LinkedInAd, MicrosoftAd } from "./types.ts";

/**
 * Generate fallback Google ads when the OpenAI call fails
 */
export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult): GoogleAd[] {
  const { companyName, businessDescription, callToAction, keywords } = campaignData;
  const shortDescription = businessDescription?.substring(0, 80) || "";
  const cta = Array.isArray(callToAction) ? callToAction[0] : callToAction || "Entre em contato";
  const keywordText = Array.isArray(keywords) && keywords.length > 0 ? keywords.slice(0, 3).join(", ") : "";
  const companyDesc = businessDescription || companyName;
  
  // Avoid using generic terms by using campaign-specific information
  const headline1Options = [
    `${companyName}`,
    `Conheça ${companyName}`,
    `${companyName} - Especialista`,
    `${companyName} - Líder`,
    `Descubra ${companyName}`
  ];
  
  const headline2Options = [
    keywordText ? `${keywordText}` : "Inovação",
    "Resultados Comprovados",
    "Transformação de Negócios",
    "Soluções Personalizadas",
    "Resultados Garantidos"
  ];
  
  const headline3Options = [
    "Fale Conosco Hoje",
    "Agende Agora",
    "Saiba Mais",
    "Visite Nosso Site",
    "Solicite Proposta"
  ];

  return [
    {
      headline1: headline1Options[0],
      headline2: headline2Options[0],
      headline3: headline3Options[0],
      description1: shortDescription || `${companyName} oferece ${keywordText || "soluções"}. ${cta}`,
      description2: `Descubra como podemos transformar seu negócio com nossa abordagem única.`,
      headlines: [
        headline1Options[0],
        headline2Options[0],
        headline3Options[0]
      ],
      descriptions: [
        shortDescription || `${companyName} oferece ${keywordText || "soluções"}. ${cta}`,
        `Descubra como podemos transformar seu negócio com nossa abordagem única.`
      ],
      path1: "soluções",
      path2: "inovação"
    },
    {
      headline1: headline1Options[1],
      headline2: headline2Options[1],
      headline3: headline3Options[1],
      description1: shortDescription || `${companyDesc}. Transforme seu negócio hoje.`,
      description2: `Entre em contato para descobrir como podemos ajudar a alcançar seus objetivos.`,
      headlines: [
        headline1Options[1],
        headline2Options[1],
        headline3Options[1]
      ],
      descriptions: [
        shortDescription || `${companyDesc}. Transforme seu negócio hoje.`,
        `Entre em contato para descobrir como podemos ajudar a alcançar seus objetivos.`
      ],
      path1: "transformação",
      path2: "negócios"
    },
    {
      headline1: headline1Options[2],
      headline2: headline2Options[2],
      headline3: headline3Options[2],
      description1: shortDescription || `Experiência comprovada em ${keywordText || "transformação"}. ${cta}`,
      description2: `Junte-se a empresas de sucesso que confiam em nossa expertise.`,
      headlines: [
        headline1Options[2],
        headline2Options[2],
        headline3Options[2]
      ],
      descriptions: [
        shortDescription || `Experiência comprovada em ${keywordText || "transformação"}. ${cta}`,
        `Junte-se a empresas de sucesso que confiam em nossa expertise.`
      ],
      path1: "resultados",
      path2: "garantidos"
    },
    {
      headline1: headline1Options[3],
      headline2: headline2Options[3],
      headline3: headline3Options[3],
      description1: shortDescription || `${companyName} é referência em ${keywordText || "inovação"}.`,
      description2: `${cta}. Descubra o que podemos fazer por sua empresa.`,
      headlines: [
        headline1Options[3],
        headline2Options[3],
        headline3Options[3]
      ],
      descriptions: [
        shortDescription || `${companyName} é referência em ${keywordText || "inovação"}.`,
        `${cta}. Descubra o que podemos fazer por sua empresa.`
      ],
      path1: "especialistas",
      path2: "referência"
    },
    {
      headline1: headline1Options[4],
      headline2: headline2Options[4],
      headline3: headline3Options[4],
      description1: shortDescription || `${companyDesc}. Resultados comprovados.`,
      description2: `${cta}. Estamos prontos para transformar sua visão em realidade.`,
      headlines: [
        headline1Options[4],
        headline2Options[4],
        headline3Options[4]
      ],
      descriptions: [
        shortDescription || `${companyDesc}. Resultados comprovados.`,
        `${cta}. Estamos prontos para transformar sua visão em realidade.`
      ],
      path1: "transformação",
      path2: "sucesso"
    }
  ];
}

/**
 * Generate fallback Meta/Instagram ads when the OpenAI call fails
 */
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  const { companyName, businessDescription, callToAction, uniqueSellingPoints, keywords } = campaignData;
  const shortDescription = businessDescription?.substring(0, 100) || "";
  const cta = Array.isArray(callToAction) ? callToAction[0] : callToAction || "Saiba mais";
  const sellingPoint = Array.isArray(uniqueSellingPoints) && uniqueSellingPoints.length > 0 
    ? uniqueSellingPoints[0] 
    : "";
  const keywordText = Array.isArray(keywords) && keywords.length > 0 ? keywords[0] : "inovação";

  return [
    {
      headline: `Transforme com ${companyName}`,
      primaryText: shortDescription || `Descubra como ${companyName} pode ajudar você a alcançar resultados extraordinários com ${keywordText}.`,
      description: cta,
      imagePrompt: `Foto profissional representando ${companyName} e ${keywordText}, com elementos visuais que transmitem inovação e transformação de negócios, em ambiente corporativo moderno, iluminação profissional.`,
      format: "feed"
    },
    {
      headline: `Experiência ${companyName}`,
      primaryText: sellingPoint ? `${sellingPoint}. ${shortDescription || `Com ${companyName}, entregamos resultados excepcionais em ${keywordText}.`}` : 
        `${shortDescription || `Com ${companyName}, entregamos resultados excepcionais em ${keywordText}.`}`,
      description: cta,
      imagePrompt: `Imagem profissional e criativa para ${companyName} mostrando resultados transformadores em ambiente de negócios, com pessoas em reunião produtiva, elementos que representam ${keywordText}.`,
      format: "feed"
    },
    {
      headline: `${companyName} - Sua Solução`,
      primaryText: shortDescription || `Procurando o melhor em ${keywordText}? ${companyName} entrega resultados que superam expectativas.`,
      description: cta,
      imagePrompt: `Fotografia profissional mostrando os serviços de ${companyName} em ação, com elementos que representam ${keywordText} e transformação de negócios, estilo visual moderno e profissional.`,
      format: "feed"
    }
  ];
}

/**
 * Generate fallback LinkedIn ads when the OpenAI call fails
 */
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): LinkedInAd[] {
  const { companyName, businessDescription, callToAction, uniqueSellingPoints, keywords } = campaignData;
  const shortDescription = businessDescription?.substring(0, 100) || "";
  const cta = Array.isArray(callToAction) ? callToAction[0] : callToAction || "Saiba mais";
  const sellingPoint = Array.isArray(uniqueSellingPoints) && uniqueSellingPoints.length > 0 
    ? uniqueSellingPoints[0] 
    : "";
  const keywordText = Array.isArray(keywords) && keywords.length > 0 ? keywords[0] : "inovação";

  return [
    {
      headline: `Impulsione Resultados com ${companyName}`,
      primaryText: shortDescription || `Para empresas que buscam liderança em ${keywordText}, ${companyName} oferece soluções que transformam desafios em oportunidades. ${sellingPoint ? `\n\n${sellingPoint}` : ""}`,
      description: cta,
      imagePrompt: `Imagem profissional corporativa mostrando ambiente de negócios com executivos discutindo estratégias, elementos que representam ${keywordText} e crescimento empresarial, estilo LinkedIn, profissional e confiável.`,
      format: "single-image"
    },
    {
      headline: `${companyName} | Expertise em ${keywordText}`,
      primaryText: sellingPoint ? `${sellingPoint}. ${shortDescription || `${companyName} ajuda empresas a alcançarem novos patamares através de soluções inovadoras em ${keywordText}.`}` : 
        `${shortDescription || `${companyName} ajuda empresas a alcançarem novos patamares através de soluções inovadoras em ${keywordText}.`}`,
      description: cta,
      imagePrompt: `Foto corporativa profissional representando liderança e excelência nos negócios, com elementos que transmitem ${keywordText} e transformação, visual adequado para LinkedIn, perfil corporativo B2B.`,
      format: "single-image"
    },
    {
      headline: `Potencialize seu Negócio com ${companyName}`,
      primaryText: shortDescription || `Empresas líderes confiam em ${companyName} para impulsionar resultados através de estratégias inovadoras em ${keywordText}.`,
      description: cta,
      imagePrompt: `Imagem corporativa profissional mostrando ambiente de trabalho produtivo com equipe engajada, elementos que representam ${keywordText} e transformação empresarial, estética formal para LinkedIn.`,
      format: "single-image"
    }
  ];
}

/**
 * Generate fallback Microsoft ads when the OpenAI call fails
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult): MicrosoftAd[] {
  return generateFallbackGoogleAds(campaignData) as unknown as MicrosoftAd[];
}
