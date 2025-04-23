
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { GoogleAdCard } from "@/components/campaign/ad-preview/google/GoogleAdCard";
import { InstagramPreview } from "@/components/campaign/ad-preview/meta/instagram-preview/InstagramPreview";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ReviewAdsProps {
  ads: Record<string, any[]>;
  onApprove: (approvedAds: Record<string, any[]>) => void;
  onBack: () => void;
}

export const ReviewAds = ({ ads, onApprove, onBack }: ReviewAdsProps) => {
  const [approvedAds, setApprovedAds] = useState<Record<string, any[]>>(ads);
  const [activeTab, setActiveTab] = useState(Object.keys(ads)[0] || "google");
  const [editMode, setEditMode] = useState<{platform: string, index: number} | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();

  const platforms = Object.keys(ads);
  
  const handleToggleEdit = (platform: string, index: number, ad: any) => {
    if (editMode && editMode.platform === platform && editMode.index === index) {
      // Save changes
      try {
        const parsedValue = JSON.parse(editValue);
        handleUpdate(platform, index, parsedValue);
        setEditMode(null);
        toast({
          title: "Alterações salvas",
          description: "O anúncio foi atualizado com sucesso",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "O formato JSON é inválido",
        });
      }
    } else {
      // Enter edit mode
      setEditMode({ platform, index });
      setEditValue(JSON.stringify(ad, null, 2));
    }
  };

  const handleUpdate = (platform: string, index: number, newValue: any) => {
    const updated = [...approvedAds[platform]];
    updated[index] = newValue;
    setApprovedAds({ ...approvedAds, [platform]: updated });
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

  const renderAdPreview = (platform: string, ad: any, index: number) => {
    if (editMode && editMode.platform === platform && editMode.index === index) {
      return (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full border h-80 font-mono text-sm"
        />
      );
    }

    switch (platform) {
      case "google":
        return <GoogleAdCard ad={ad} />;
      case "meta":
        return <InstagramPreview ad={ad} showControls={false} />;
      default:
        return (
          <div className="border p-4 rounded-md">
            <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-60">
              {JSON.stringify(ad, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">2. Revisar e Aprovar Anúncios</CardTitle>
          <Badge variant="outline">
            {platforms.reduce((acc, platform) => acc + ads[platform].length, 0)} anúncios gerados
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {platforms.length > 0 ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              {platforms.map((platform) => (
                <TabsTrigger key={platform} value={platform} className="flex-1">
                  {getPlatformDisplayName(platform)}
                  <Badge variant="secondary" className="ml-2">
                    {ads[platform].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {platforms.map((platform) => (
              <TabsContent key={platform} value={platform} className="space-y-4">
                {ads[platform].map((ad, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Anúncio {index + 1}</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleEdit(platform, index, ad)}
                      >
                        {editMode && editMode.platform === platform && editMode.index === index
                          ? "Salvar" 
                          : "Editar"}
                      </Button>
                    </div>
                    {renderAdPreview(platform, ad, index)}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum anúncio gerado</AlertTitle>
            <AlertDescription>
              Volte para a etapa anterior e gere alguns anúncios.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button 
          onClick={() => onApprove(approvedAds)}
          disabled={Object.keys(approvedAds).length === 0}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Aprovar e Avançar
        </Button>
      </CardFooter>
    </Card>
  );
};
