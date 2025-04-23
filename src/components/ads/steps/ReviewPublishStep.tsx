import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Loader } from "lucide-react";
import { toast } from "sonner";

interface ReviewPublishStepProps {
  campaignData: any;
  onBack: () => void;
  onFinish: () => Promise<void>;
  canPublish: boolean;
}

const ReviewPublishStep: React.FC<ReviewPublishStepProps> = ({
  campaignData,
  onBack,
  onFinish,
  canPublish
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  
  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // In a real app, this would make API calls to publish ads to various platforms
      onFinish();
    } catch (error) {
      console.error("Error publishing campaign:", error);
      toast.error("Erro ao publicar campanha. Tente novamente.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Revisar e Publicar</h2>
      <p className="text-muted-foreground">
        Revise todas as informações da campanha antes de publicar. Após a publicação, seus anúncios
        serão enviados para as plataformas selecionadas.
      </p>

      <div className="space-y-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Resumo da Campanha</h3>
            
            <div className="space-y-4">
              <SummarySection 
                title="Informações do Negócio"
                items={[
                  { label: "Nome do Negócio", value: campaignData.businessName },
                  { label: "Indústria", value: campaignData.industry },
                  { label: "Tipo de Negócio", value: campaignData.businessType }
                ]}
              />
              
              <SummarySection 
                title="Plataformas Selecionadas"
                items={campaignData.platforms.map((p: string) => ({ 
                  label: getPlatformName(p),
                  value: `Orçamento: R$ ${campaignData.budget?.[p] || 0}/dia`
                }))}
              />
              
              <SummarySection 
                title="Público-Alvo"
                items={[
                  { label: "Perfil do Público", value: campaignData.audienceProfile },
                  { label: "Geolocalização", value: campaignData.geolocation }
                ]}
              />
              
              <SummarySection 
                title="Objetivos da Campanha"
                items={[
                  { label: "Objetivo Principal", value: getGoalName(campaignData.campaignGoal) },
                  { label: "Data de Início", value: formatDate(campaignData.startDate) },
                  { label: "Data de Término", value: campaignData.endDate ? formatDate(campaignData.endDate) : "Não definida" }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          {campaignData.platforms.map((platform: string) => (
            <AccordionItem key={platform} value={platform}>
              <AccordionTrigger className="text-base font-medium">
                Anúncios para {getPlatformName(platform)}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {campaignData.ads[platform]?.map((ad: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="bg-muted p-3 border-b">
                        <h4 className="font-medium">Variação {index + 1}</h4>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <div>
                          <span className="text-sm font-medium">Título:</span>
                          <p className="mt-1">{ad.headline}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Descrição:</span>
                          <p className="mt-1">{ad.description}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Chamada para ação:</span>
                          <p className="mt-1">{ad.cta}</p>
                        </div>
                        {ad.imagePrompt && (
                          <div>
                            <span className="text-sm font-medium">Prompt para imagem:</span>
                            <p className="mt-1">{ad.imagePrompt}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button 
          onClick={handlePublish}
          disabled={isPublishing || !canPublish}
        >
          {isPublishing ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              Publicando...
            </>
          ) : (
            <>
              <Check size={16} className="mr-2" />
              Publicar Campanha
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Helper component for summary sections
interface SummaryItem {
  label: string;
  value: string;
}

interface SummarySectionProps {
  title: string;
  items: SummaryItem[];
}

const SummarySection: React.FC<SummarySectionProps> = ({ title, items }) => {
  return (
    <div>
      <h4 className="font-medium text-sm text-muted-foreground mb-2">{title}</h4>
      <div className="bg-muted/40 rounded-md p-3 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">{item.label}:</div>
            <div className="text-sm col-span-2">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions
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

function getGoalName(goalId: string): string {
  const goals: Record<string, string> = {
    awareness: "Reconhecimento de marca",
    consideration: "Consideração",
    conversion: "Conversão"
  };
  
  return goals[goalId] || goalId;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (e) {
    return dateString;
  }
}

export default ReviewPublishStep;
