
import { toast } from "sonner";

export interface AdGenerationParams {
  companyName: string;
  websiteUrl: string;
  companyDescription?: string;
  product?: string;
  objective?: string;
  targetAudience?: string;
  brandTone?: string;
  platforms: string[];
}

export const generateAds = async (params: AdGenerationParams): Promise<Record<string, any[]>> => {
  // Mock implementation that generates ads for each platform
  console.log("Generating ads with params:", params);
  
  // This would normally call the Supabase function that uses OpenAI
  // For now, we'll return mock data
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const result: Record<string, any[]> = {};
  
  // Generate mock ads for each selected platform
  for (const platform of params.platforms) {
    switch (platform) {
      case 'google':
        result.google = generateGoogleAds(params);
        break;
      case 'meta':
        result.meta = generateMetaAds(params);
        break;
      case 'linkedin':
        result.linkedin = generateLinkedInAds(params);
        break;
      case 'microsoft':
        result.microsoft = generateMicrosoftAds(params);
        break;
    }
  }
  
  return result;
};

function generateGoogleAds(params: AdGenerationParams): any[] {
  return [
    {
      headline1: `${params.companyName} | Soluções de Qualidade`,
      headline2: "Resultados Garantidos",
      headline3: "Conheça Nossos Serviços",
      description1: `${params.companyDescription?.substring(0, 80) || 'Oferecemos soluções personalizadas para o seu negócio crescer e se destacar no mercado.'}`,
      description2: "Entre em contato hoje mesmo e solicite um orçamento!",
      path1: "servicos",
      path2: "contato",
      finalUrl: params.websiteUrl,
      isComplete: true
    },
    {
      headline1: `Conheça a ${params.companyName}`,
      headline2: "Especialistas em Soluções",
      headline3: "Atendimento Diferenciado",
      description1: "Transformamos ideias em resultados. Nossa equipe está pronta para atender suas necessidades.",
      description2: "Visite nosso site e descubra como podemos ajudar seu negócio.",
      path1: "sobre",
      path2: "solucoes",
      finalUrl: params.websiteUrl,
      isComplete: true
    },
    {
      headline1: `${params.companyName} - Líder no Mercado`,
      headline2: "Inovação e Tecnologia",
      headline3: "Solicite Uma Demonstração",
      description1: "Tecnologia avançada e processos otimizados para garantir a melhor experiência para os seus clientes.",
      description2: "Solicite uma demonstração gratuita hoje mesmo!",
      path1: "tecnologia",
      path2: "demo",
      finalUrl: params.websiteUrl,
      isComplete: true
    }
  ];
}

function generateMetaAds(params: AdGenerationParams): any[] {
  return [
    {
      headline: `Conheça a ${params.companyName}`,
      primaryText: `${params.companyDescription || 'Soluções inovadoras para o seu negócio crescer. Nossos especialistas estão prontos para atender todas as suas necessidades.'}`,
      description: "Visite nosso site e descubra mais!",
      imagePrompt: `Uma imagem profissional e moderna representando ${params.companyName}, com cores vibrantes e design limpo.`,
      imageUrl: "https://placehold.co/600x600/5271ff/ffffff?text=Instagram+Ad",
      isComplete: true
    },
    {
      headline: `${params.companyName} - Transformando Negócios`,
      primaryText: "Soluções personalizadas para cada tipo de negócio. Nossa equipe de especialistas está pronta para ajudar você a alcançar seus objetivos.",
      description: "Entre em contato hoje mesmo!",
      imagePrompt: `Uma imagem mostrando o resultado dos serviços oferecidos por ${params.companyName}, com pessoas satisfeitas.`,
      imageUrl: "https://placehold.co/600x600/ff5252/ffffff?text=Instagram+Ad+2",
      isComplete: true
    }
  ];
}

function generateLinkedInAds(params: AdGenerationParams): any[] {
  return [
    {
      headline: `${params.companyName} - Soluções Corporativas`,
      primaryText: `${params.companyDescription || 'Ajudamos empresas a alcançar seu potencial máximo com soluções personalizadas e atendimento diferenciado.'}`,
      description: "Conheça nossos serviços corporativos",
      imagePrompt: `Uma imagem profissional mostrando o ambiente corporativo da ${params.companyName}, com pessoas em reunião de negócios.`,
      imageUrl: "https://placehold.co/1200x627/0077b5/ffffff?text=LinkedIn+Ad",
      isComplete: true
    }
  ];
}

function generateMicrosoftAds(params: AdGenerationParams): any[] {
  return [
    {
      headline1: `${params.companyName} | Soluções Profissionais`,
      headline2: "Qualidade Garantida",
      headline3: "Conheça Nossos Especialistas",
      description1: `${params.companyDescription?.substring(0, 80) || 'Oferecemos soluções de alta qualidade para empresas que buscam crescimento sustentável.'}`,
      description2: "Entre em contato e descubra como podemos ajudar.",
      path1: "servicos",
      path2: "qualidade",
      finalUrl: params.websiteUrl,
      isComplete: true
    },
    {
      headline1: `Descubra a ${params.companyName}`,
      headline2: "Resultados Comprovados",
      headline3: "Solicite um Orçamento",
      description1: "Ajudamos empresas a transformar desafios em oportunidades com soluções inovadoras.",
      description2: "Visite nosso site e solicite um orçamento personalizado.",
      path1: "sobre",
      path2: "orcamento",
      finalUrl: params.websiteUrl,
      isComplete: true
    }
  ];
}

// Track credit usage for ad generation
export const trackAdGenerationCredits = async (
  userId: string, 
  platforms: string[], 
  adsCount: number
): Promise<void> => {
  try {
    // In a real app, this would record the credit usage in the database
    console.log(`Tracking credit usage for user ${userId}: ${platforms.length * 5} credits used for generating ${adsCount} ads across ${platforms.length} platforms`);
  } catch (error) {
    console.error('Failed to track credit usage:', error);
  }
};
