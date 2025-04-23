
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCredits } from "@/contexts/CreditsContext";

interface PublishAdsProps {
  ads: Record<string, any[]>;
  campaignData: any;
  onBack: () => void;
  onFinish: () => void;
}

export const PublishAds: React.FC<PublishAdsProps> = ({ 
  ads, 
  campaignData, 
  onBack, 
  onFinish 
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [publishedAds, setPublishedAds] = useState<Record<string, any[]>>({});
  const { credits, deductCredits } = useCredits();
  
  const platformIntegrationStatus = {
    google: true, // Mocked status for demo
    meta: true,
    linkedin: false,
    microsoft: false
  };
  
  const totalAdsCount = Object.values(ads).reduce(
    (sum, platformAds) => sum + platformAds.length, 
    0
  );
  
  const publishCreditCost = 10; // Cost per platform
  const totalCost = Object.keys(ads).length * publishCreditCost;
  
  const handlePublish = async () => {
    if (credits < totalCost) {
      toast.error("Créditos insuficientes", {
        description: `Você precisa de ${totalCost} créditos para publicar em ${Object.keys(ads).length} plataformas.`
      });
      return;
    }
    
    setIsPublishing(true);
    
    // Simulate publishing process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        completePublishing();
      }
    }, 200);
  };
  
  const completePublishing = async () => {
    try {
      // In a real app, this would make API calls to publish the ads
      // For now, we're just simulating
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Deduct credits
      await deductCredits(totalCost);
      
      // Mock successful publishing
      const published: Record<string, any[]> = {};
      Object.keys(ads).forEach(platform => {
        published[platform] = ads[platform].map(ad => ({
          ...ad,
          published: true,
          publishedAt: new Date().toISOString(),
          externalId: `${platform}-${Math.random().toString(36).substring(2, 10)}`
        }));
      });
      
      setPublishedAds(published);
      
      toast.success("Anúncios publicados com sucesso!", {
        description: `Foram publicados ${totalAdsCount} anúncios em ${Object.keys(ads).length} plataformas.`
      });
      
      // Wait a moment before finishing
      setTimeout(() => {
        onFinish();
      }, 2000);
    } catch (error) {
      console.error("Error publishing ads:", error);
      toast.error("Erro ao publicar anúncios", {
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Format campaign name
  const campaignName = campaignData?.companyName 
    ? `${campaignData.companyName} - ${new Date().toLocaleDateString('pt-BR')}`
    : `Nova Campanha - ${new Date().toLocaleDateString('pt-BR')}`;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publicar Anúncios</CardTitle>
          <CardDescription>
            Configure os detalhes finais antes de publicar seus anúncios nas plataformas selecionadas.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium">Detalhes da Campanha</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input 
                  id="campaign-name" 
                  defaultValue={campaignName} 
                  disabled={isPublishing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget-type">Tipo de Orçamento</Label>
                <Select defaultValue="daily" disabled={isPublishing}>
                  <SelectTrigger id="budget-type">
                    <SelectValue placeholder="Selecione o tipo de orçamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="lifetime">Total da Campanha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-base font-medium">Plataformas Conectadas</h3>
            <div className="space-y-3">
              {Object.keys(ads).map(platform => (
                <div key={platform} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${platformIntegrationStatus[platform as keyof typeof platformIntegrationStatus] ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="capitalize">{platform}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">
                      {ads[platform]?.length} anúncios
                    </span>
                    {platformIntegrationStatus[platform as keyof typeof platformIntegrationStatus] ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-base font-medium">Configurações de Publicação</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-optimize">Otimização Automática</Label>
                <p className="text-sm text-muted-foreground">
                  A IA otimizará automaticamente seus anúncios com base no desempenho
                </p>
              </div>
              <Switch id="auto-optimize" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-pause">Pausar Anúncios de Baixo Desempenho</Label>
                <p className="text-sm text-muted-foreground">
                  Pausar automaticamente anúncios com CTR abaixo de 1%
                </p>
              </div>
              <Switch id="auto-pause" defaultChecked />
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              A publicação custará {totalCost} créditos ({publishCreditCost} por plataforma).
              Você tem atualmente {credits} créditos disponíveis.
            </AlertDescription>
          </Alert>
          
          {isPublishing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Publicando anúncios...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            disabled={isPublishing}
          >
            Voltar
          </Button>
          
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || credits < totalCost}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                Publicar Anúncios
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {Object.keys(publishedAds).length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-green-700">Publicação Concluída!</h3>
            </div>
            <p className="text-green-700">
              Todos os {totalAdsCount} anúncios foram publicados com sucesso nas plataformas selecionadas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
