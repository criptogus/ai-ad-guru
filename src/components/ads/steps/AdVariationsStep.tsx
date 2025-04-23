
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AdVariationsStepProps {
  campaignData: any;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: (data: any) => void;
  onBack: () => void;
}

interface Ad {
  headline: string;
  description: string;
  cta: string;
  imagePrompt?: string;
  imageUrl?: string;
}

const AdVariationsStep: React.FC<AdVariationsStepProps> = ({
  campaignData,
  isGenerating,
  setIsGenerating,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [ads, setAds] = useState<Record<string, Ad[]>>(campaignData.ads || {});
  const selectedPlatforms = campaignData.platforms || [];

  // Set initial active tab
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !activeTab) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms]);

  // Generate ad variations
  const generateAds = async () => {
    setIsGenerating(true);
    
    try {
      // Store the generated ads for each platform
      const generatedAds: Record<string, Ad[]> = {};
      
      // Generate ads for each platform
      for (const platform of selectedPlatforms) {
        // Simulate API call with delayed response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate platform-specific ads
        generatedAds[platform] = generatePlatformAds(platform, 3); // Generate 3 variations
      }
      
      setAds(generatedAds);
      toast.success("Anúncios gerados com sucesso!");
      
    } catch (error) {
      console.error("Error generating ads:", error);
      toast.error("Erro ao gerar variações de anúncios.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate mock ads for a platform (in real app, this would be an API call)
  const generatePlatformAds = (platform: string, count: number): Ad[] => {
    const businessName = campaignData.businessName || "Sua Empresa";
    const mindTrigger = campaignData.mindTrigger || "scarcity";
    
    let ads: Ad[] = [];
    
    if (platform === "google") {
      ads = [
        {
          headline: `${businessName} - Soluções Profissionais`,
          description: `Aumente seus resultados com nossas soluções premium. Atendimento especializado para cada cliente.`,
          cta: "Saiba Mais"
        },
        {
          headline: `${businessName} - Especialistas em Resultados`,
          description: `Impulsione seu negócio com estratégias comprovadas. Clientes satisfeitos em todo o Brasil.`,
          cta: "Conheça Agora"
        },
        {
          headline: `${businessName} - Resultados Garantidos`,
          description: `Estratégias personalizadas para o seu negócio. Comece hoje e veja a diferença.`,
          cta: "Ver Planos"
        }
      ];
    } else if (platform === "instagram" || platform === "facebook") {
      ads = [
        {
          headline: `Transforme seu negócio com ${businessName}`,
          description: `Nossas soluções já ajudaram mais de 1000 clientes a aumentarem seus resultados. Descubra como podemos te ajudar também.`,
          cta: "Saiba Mais",
          imagePrompt: `Professional advertisement for ${businessName}, showing business success, with clean modern design`
        },
        {
          headline: `Resultados reais com ${businessName}`,
          description: `Clientes relatam aumento de até 30% nos resultados após implementarem nossas soluções. Quer ser o próximo?`,
          cta: "Quero Resultados",
          imagePrompt: `Business growth chart showing success, professional advertisement for ${businessName}`
        },
        {
          headline: `${businessName}: Soluções que funcionam`,
          description: `Tecnologia de ponta e equipe especializada para entregar os melhores resultados para seu negócio.`,
          cta: "Começar Agora",
          imagePrompt: `Modern technology and business team working together, advertisement for ${businessName}`
        }
      ];
    } else if (platform === "linkedin") {
      ads = [
        {
          headline: `Potencialize sua estratégia com ${businessName}`,
          description: `Soluções corporativas que impulsionam resultados. Nossos especialistas estão prontos para ajudar sua empresa a crescer.`,
          cta: "Agendar Consultoria",
          imagePrompt: `Professional business meeting, corporate environment, advertisement for ${businessName}`
        },
        {
          headline: `${businessName}: Parceria para o sucesso`,
          description: `Junte-se a mais de 500 empresas que já transformaram seus resultados com nossas soluções corporativas.`,
          cta: "Fale com Especialista",
          imagePrompt: `Business partnership handshake, professional setting, advertisement for ${businessName}`
        },
        {
          headline: `Soluções B2B de ${businessName}`,
          description: `Estratégias personalizadas para empresas que buscam crescimento sustentável e resultados concretos.`,
          cta: "Solicitar Proposta",
          imagePrompt: `B2B business meeting with charts and presentations, advertisement for ${businessName}`
        }
      ];
    } else {
      ads = [
        {
          headline: `${businessName} - Soluções Inovadoras`,
          description: `Descubra como podemos transformar seu negócio com nossas soluções personalizadas.`,
          cta: "Conhecer"
        },
        {
          headline: `Experimente ${businessName}`,
          description: `Junte-se a clientes satisfeitos que já transformaram seus resultados.`,
          cta: "Começar"
        },
        {
          headline: `${businessName} - Excelência Garantida`,
          description: `Qualidade e resultados são nossa prioridade. Venha descobrir a diferença.`,
          cta: "Ver Soluções"
        }
      ];
    }
    
    // Add mind trigger elements based on selected trigger
    return addMindTriggerElements(ads, mindTrigger);
  };

  // Add mind trigger elements to ads
  const addMindTriggerElements = (ads: Ad[], trigger: string): Ad[] => {
    // Apply mind trigger modifications based on trigger type
    switch (trigger) {
      case "scarcity":
        return ads.map(ad => ({
          ...ad,
          headline: ad.headline.includes("Limitado") ? ad.headline : `${ad.headline} | Oferta Limitada`,
          description: ad.description.includes("vagas limitadas") ? 
            ad.description : 
            `${ad.description} Vagas limitadas, garanta a sua agora.`
        }));
        
      case "social_proof":
        return ads.map(ad => ({
          ...ad,
          headline: ad.headline.includes("clientes") ? ad.headline : `${ad.headline} | Escolha de Milhares`,
          description: ad.description.includes("clientes satisfeitos") ? 
            ad.description : 
            `${ad.description} Junte-se a mais de 10.000 clientes satisfeitos.`
        }));
        
      case "authority":
        return ads.map(ad => ({
          ...ad,
          headline: ad.headline.includes("Especialista") ? ad.headline : `${ad.headline} | Especialistas Certificados`,
          description: ad.description.includes("especialistas") ? 
            ad.description : 
            `${ad.description} Desenvolvido por especialistas reconhecidos no mercado.`
        }));
        
      case "reciprocity":
        return ads.map(ad => ({
          ...ad,
          headline: ad.headline.includes("Grátis") ? ad.headline : `${ad.headline} | Avaliação Grátis`,
          description: ad.description.includes("teste grátis") ? 
            ad.description : 
            `${ad.description} Obtenha um teste grátis por 7 dias sem compromisso.`
        }));
        
      default:
        return ads;
    }
  };

  // Handle ad field change
  const handleAdChange = (platform: string, index: number, field: keyof Ad, value: string) => {
    setAds(prevAds => {
      const platformAds = [...(prevAds[platform] || [])];
      platformAds[index] = {
        ...platformAds[index],
        [field]: value
      };
      
      return {
        ...prevAds,
        [platform]: platformAds
      };
    });
  };

  const handleNext = () => {
    onNext({ ads });
  };

  const isValid = () => {
    // Check if there are ads for each platform
    return selectedPlatforms.every(platform => 
      ads[platform] && ads[platform].length > 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Variações de Anúncios</h2>
        <Button
          variant={Object.keys(ads).length > 0 ? "outline" : "default"}
          size="sm"
          onClick={generateAds}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              Gerando...
            </>
          ) : Object.keys(ads).length > 0 ? (
            <>
              <RefreshCw size={16} className="mr-2" />
              Regenerar
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Gerar Anúncios
            </>
          )}
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        A IA criará variações de anúncios para cada plataforma selecionada com base nas informações fornecidas.
        Você pode editar os anúncios gerados para melhor se adequarem à sua marca.
      </p>

      {selectedPlatforms.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            {selectedPlatforms.map(platform => (
              <TabsTrigger key={platform} value={platform}>
                {getPlatformName(platform)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedPlatforms.map(platform => (
            <TabsContent key={platform} value={platform}>
              {ads[platform]?.length > 0 ? (
                <div className="space-y-6">
                  {ads[platform].map((ad, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-card">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Variação {index + 1}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Título</label>
                          <Input
                            value={ad.headline}
                            onChange={(e) => handleAdChange(platform, index, 'headline', e.target.value)}
                            maxLength={platform === 'google' ? 30 : 40}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Descrição</label>
                          <Textarea
                            value={ad.description}
                            onChange={(e) => handleAdChange(platform, index, 'description', e.target.value)}
                            maxLength={platform === 'google' ? 90 : 125}
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Chamada para Ação</label>
                          <Input
                            value={ad.cta}
                            onChange={(e) => handleAdChange(platform, index, 'cta', e.target.value)}
                            maxLength={20}
                          />
                        </div>
                        
                        {(platform === 'instagram' || platform === 'facebook' || platform === 'linkedin') && (
                          <div>
                            <label className="block text-sm font-medium mb-1">Prompt para Imagem</label>
                            <Textarea
                              value={ad.imagePrompt}
                              onChange={(e) => handleAdChange(platform, index, 'imagePrompt', e.target.value)}
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <p>Nenhum anúncio gerado ainda. Clique em "Gerar Anúncios" para começar.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p>Nenhuma plataforma selecionada. Volte para selecionar pelo menos uma plataforma.</p>
        </div>
      )}

      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button 
          onClick={handleNext}
          disabled={!isValid()}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

// Helper function to get platform display name
function getPlatformName(platformId: string): string {
  const platforms: Record<string, string> = {
    google: "Google Ads",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    microsoft: "Microsoft Ads"
  };
  
  return platforms[platformId] || platformId;
}

export default AdVariationsStep;
