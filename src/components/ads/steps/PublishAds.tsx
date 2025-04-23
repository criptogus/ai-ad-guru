
import React, { useState } from "react";
import { publishAds } from "@/services/ads/publishService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Info, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface PublishAdsProps {
  ads: Record<string, any[]>;
  campaignData: any;
  onBack: () => void;
  onFinish?: () => void;
}

export const PublishAds = ({ ads, campaignData, onBack, onFinish }: PublishAdsProps) => {
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Record<string, {success: number, error: number}>>({});
  const { toast } = useToast();

  const totalAds = Object.values(ads).reduce((total, platformAds) => total + platformAds.length, 0);
  
  const handlePublish = async () => {
    try {
      setLoading(true);
      setProgress(0);
      
      let currentProgress = 0;
      const progressIncrement = 100 / totalAds;
      const publishResults: Record<string, {success: number, error: number}> = {};
      
      // Publish ads for each platform
      for (const platform of Object.keys(ads)) {
        publishResults[platform] = { success: 0, error: 0 };
        
        for (const ad of ads[platform]) {
          try {
            await publishAds({ 
              platform, 
              ad, 
              campaignData 
            });
            
            publishResults[platform].success++;
          } catch (error) {
            console.error(`Error publishing ad for ${platform}:`, error);
            publishResults[platform].error++;
          }
          
          // Update progress
          currentProgress += progressIncrement;
          setProgress(Math.min(Math.round(currentProgress), 100));
          
          // Small delay to show progress
          await new Promise(r => setTimeout(r, 400));
        }
      }
      
      setResults(publishResults);
      setPublished(true);
      
      const totalSuccess = Object.values(publishResults)
        .reduce((sum, result) => sum + result.success, 0);
      
      if (totalSuccess === totalAds) {
        toast({
          title: "Publicação concluída",
          description: `Todos os ${totalAds} anúncios foram publicados com sucesso`,
        });
      } else {
        toast({
          variant: "default",
          title: "Publicação parcial",
          description: `${totalSuccess} de ${totalAds} anúncios foram publicados com sucesso`,
        });
      }
      
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro na publicação",
        description: err.message || "Ocorreu um erro ao publicar os anúncios",
      });
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "google": return "Google Ads";
      case "meta": return "Meta/Instagram";
      case "linkedin": return "LinkedIn";
      case "microsoft": return "Microsoft";
      default: return platform;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">3. Publicar Anúncios</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Revisão final</AlertTitle>
          <AlertDescription>
            Você está prestes a publicar {totalAds} anúncios nas plataformas selecionadas.
            Esta ação pode consumir créditos da sua conta.
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Resumo dos anúncios a serem publicados:</h3>
          <ScrollArea className="h-52">
            {Object.entries(ads).map(([platform, platformAds]) => (
              <div key={platform} className="mb-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{getPlatformDisplayName(platform)}</h4>
                  <Badge variant="outline">{platformAds.length} anúncios</Badge>
                </div>
                <Separator className="my-2" />
                <ul className="space-y-1">
                  {platformAds.map((ad, index) => (
                    <li key={index} className="text-sm">
                      Anúncio {index + 1}: {getAdTitle(platform, ad)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ScrollArea>
        </div>

        {loading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Publicando anúncios ({progress}%)
            </p>
          </div>
        )}

        {published && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <h3 className="font-medium mb-3">Resultados da publicação:</h3>
            <div className="space-y-2">
              {Object.entries(results).map(([platform, result]) => (
                <div key={platform} className="flex justify-between items-center">
                  <span>{getPlatformDisplayName(platform)}</span>
                  <div className="flex gap-3">
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      {result.success} publicados
                    </Badge>
                    {result.error > 0 && (
                      <Badge variant="destructive">
                        {result.error} falhas
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        {!published ? (
          <Button onClick={handlePublish} disabled={loading || totalAds === 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publicar Anúncios
              </>
            )}
          </Button>
        ) : (
          <Button onClick={onFinish}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Concluído
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Helper function to extract a title from different ad types
function getAdTitle(platform: string, ad: any): string {
  switch (platform) {
    case "google":
      return ad.headline1 || ad.headline_1 || "Anúncio Google";
    case "meta":
      return ad.headline || ad.title || "Anúncio Instagram";
    case "linkedin":
      return ad.headline || ad.title || "Anúncio LinkedIn";
    case "microsoft":
      return ad.headline1 || ad.headline_1 || "Anúncio Microsoft";
    default:
      return "Anúncio";
  }
}
