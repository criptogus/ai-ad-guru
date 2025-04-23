
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PublishAdsProps {
  ads: Record<string, any[]>;
  campaignData: any;
  onBack: () => void;
  onFinish: () => void;
}

export const PublishAds = ({ ads, campaignData, onBack, onFinish }: PublishAdsProps) => {
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const totalAds = Object.values(ads).reduce((total, platformAds) => total + platformAds.length, 0);
  const platforms = Object.keys(ads);
  
  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    
    try {
      // Simulate API call to publish ads
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Uncomment to simulate error
      // throw new Error("Falha na publicação do anúncio na plataforma Google Ads. Verifique suas credenciais.");
      
      setPublished(true);
      setPublishing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar anúncios");
      setPublishing(false);
    }
  };
  
  const getCreditUsage = () => {
    // Calculate how many credits will be used
    let googleAdsCredits = (ads.google?.length || 0) * 5;
    let metaAdsCredits = (ads.meta?.length || 0) * 5;
    let linkedinAdsCredits = (ads.linkedin?.length || 0) * 5;
    let microsoftAdsCredits = (ads.microsoft?.length || 0) * 5;
    
    return {
      google: googleAdsCredits,
      meta: metaAdsCredits,
      linkedin: linkedinAdsCredits,
      microsoft: microsoftAdsCredits,
      total: googleAdsCredits + metaAdsCredits + linkedinAdsCredits + microsoftAdsCredits
    };
  };
  
  const creditUsage = getCreditUsage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publicar Anúncios</CardTitle>
        <CardDescription>
          Você está prestes a publicar {totalAds} anúncios em {platforms.length} plataformas diferentes.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {published ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Anúncios publicados com sucesso!</AlertTitle>
            <AlertDescription>
              Seus anúncios foram publicados nas plataformas selecionadas. Você pode verificar o status nas respectivas plataformas.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes da Publicação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {platforms.map(platform => (
                    <div key={platform} className="flex justify-between items-center py-1 border-b last:border-0">
                      <div className="font-medium capitalize">{platform}</div>
                      <div>{ads[platform].length} anúncios</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Uso de Créditos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {creditUsage.google > 0 && (
                    <div className="flex justify-between items-center py-1 border-b">
                      <div>Google Ads ({ads.google.length} anúncios)</div>
                      <div>{creditUsage.google} créditos</div>
                    </div>
                  )}
                  
                  {creditUsage.meta > 0 && (
                    <div className="flex justify-between items-center py-1 border-b">
                      <div>Meta Ads ({ads.meta.length} anúncios)</div>
                      <div>{creditUsage.meta} créditos</div>
                    </div>
                  )}
                  
                  {creditUsage.linkedin > 0 && (
                    <div className="flex justify-between items-center py-1 border-b">
                      <div>LinkedIn Ads ({ads.linkedin.length} anúncios)</div>
                      <div>{creditUsage.linkedin} créditos</div>
                    </div>
                  )}
                  
                  {creditUsage.microsoft > 0 && (
                    <div className="flex justify-between items-center py-1 border-b">
                      <div>Microsoft Ads ({ads.microsoft.length} anúncios)</div>
                      <div>{creditUsage.microsoft} créditos</div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-1 font-bold">
                    <div>Total</div>
                    <div>{creditUsage.total} créditos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={publishing || published}>
          Voltar
        </Button>
        
        {published ? (
          <Button onClick={onFinish}>
            Concluir
          </Button>
        ) : (
          <Button 
            onClick={handlePublish} 
            disabled={publishing || totalAds === 0}
          >
            {publishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar Anúncios"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
