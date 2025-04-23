
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { publishAds, trackAdPublicationCredits } from "@/services/ads/publishService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface PublishAdsProps {
  ads: Record<string, any[]>;
  campaignData: any;
  onBack: () => void;
  onFinish: () => void;
}

export const PublishAds = ({ ads, campaignData, onBack, onFinish }: PublishAdsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [publishing, setPublishing] = useState<Record<string, boolean>>({});
  const [published, setPublished] = useState<Record<string, any>>({});
  const [error, setError] = useState<Record<string, string>>({});

  const platforms = Object.keys(ads).filter(platform => ads[platform].length > 0);
  
  const calculateTotalAds = () => {
    return platforms.reduce((total, platform) => total + ads[platform].length, 0);
  };

  const calculateTotalCost = () => {
    const platformCost: Record<string, number> = {
      google: 2,
      meta: 3,
      linkedin: 5,
      microsoft: 2
    };

    return platforms.reduce((total, platform) => {
      return total + (ads[platform].length * (platformCost[platform] || 2));
    }, 0);
  };

  const handlePublish = async (platform: string) => {
    setPublishing(prev => ({ ...prev, [platform]: true }));
    setError(prev => ({ ...prev, [platform]: "" }));
    
    try {
      // Handle each ad in the platform
      const results = [];
      for (const ad of ads[platform]) {
        const result = await publishAds({ 
          platform, 
          ad, 
          campaignData 
        });
        results.push(result);
      }
      
      // Track credit usage if user is available
      if (user) {
        await trackAdPublicationCredits(
          user.id,
          platform, 
          ads[platform].length
        );
      }
      
      setPublished(prev => ({ 
        ...prev, 
        [platform]: results 
      }));
      
      toast({
        title: "Anúncios publicados",
        description: `${ads[platform].length} anúncios publicados no ${getPlatformName(platform)}`,
      });
    } catch (err: any) {
      setError(prev => ({ 
        ...prev, 
        [platform]: err.message || "Erro ao publicar anúncios" 
      }));
      
      toast({
        title: "Erro ao publicar",
        description: `Não foi possível publicar os anúncios no ${getPlatformName(platform)}`,
        variant: "destructive",
      });
    } finally {
      setPublishing(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handlePublishAll = async () => {
    for (const platform of platforms) {
      await handlePublish(platform);
    }
    
    toast({
      title: "Processo finalizado",
      description: "Todos os anúncios foram processados",
    });
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      google: "Google Ads",
      meta: "Meta Ads (Facebook/Instagram)",
      linkedin: "LinkedIn Ads",
      microsoft: "Microsoft Ads"
    };
    return names[platform] || platform;
  };

  const isAllPublished = () => {
    return platforms.every(platform => published[platform]);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Publicar Anúncios</h2>
      
      <div className="mb-6 p-4 bg-muted rounded-md">
        <h3 className="font-semibold mb-2">Resumo da publicação</h3>
        <div className="flex justify-between mb-2">
          <span>Total de anúncios:</span>
          <Badge>{calculateTotalAds()} anúncios</Badge>
        </div>
        <div className="flex justify-between">
          <span>Custo em créditos:</span>
          <Badge variant="secondary">{calculateTotalCost()} créditos</Badge>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {platforms.map(platform => (
          <div key={platform} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{getPlatformName(platform)}</h3>
              <Badge>{ads[platform].length} anúncios</Badge>
            </div>
            
            {error[platform] && (
              <div className="text-red-500 text-sm mb-2">{error[platform]}</div>
            )}
            
            <Button 
              onClick={() => handlePublish(platform)} 
              disabled={publishing[platform] || !!published[platform]}
              className="w-full"
            >
              {publishing[platform] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : published[platform] ? (
                "Publicado ✓"
              ) : (
                `Publicar no ${getPlatformName(platform)}`
              )}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Voltar para revisão
        </Button>
        
        {!isAllPublished() ? (
          <Button onClick={handlePublishAll} disabled={Object.values(publishing).some(v => v)}>
            {Object.values(publishing).some(v => v) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar todos"
            )}
          </Button>
        ) : (
          <Button onClick={onFinish}>
            Finalizar
          </Button>
        )}
      </div>
    </Card>
  );
};
