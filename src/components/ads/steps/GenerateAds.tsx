
import React, { useState } from "react";
import { generateAds } from "@/services/ads/generationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Platform = 'google' | 'meta' | 'linkedin' | 'microsoft';

interface GenerateAdsProps {
  onNext: (ads: Record<string, any[]>, formData: any) => void;
}

export const GenerateAds = ({ onNext }: GenerateAdsProps) => {
  const [form, setForm] = useState({
    companyName: "",
    websiteUrl: "",
    companyDescription: "",
    product: "",
    objective: "",
    targetAudience: "",
    brandTone: "professional",
    platforms: [] as Platform[]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlatformToggle = (platform: Platform) => {
    setForm(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      
      return { ...prev, platforms };
    });
  };

  const handleGenerate = async () => {
    try {
      if (!form.companyName || !form.websiteUrl) {
        setError("Nome da empresa e website são obrigatórios");
        return;
      }

      if (form.platforms.length === 0) {
        setError("Selecione pelo menos uma plataforma");
        return;
      }

      setError(null);
      setLoading(true);
      
      const response = await generateAds(form);
      
      onNext(response, form);
    } catch (err: any) {
      setError(err.message || "Erro ao gerar anúncios");
      console.error("Erro ao gerar anúncios:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">1. Gerar Anúncios com IA</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da Empresa*</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Ex: Acme Inc."
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website*</Label>
          <Input
            id="websiteUrl"
            type="text"
            placeholder="Ex: https://www.exemplo.com.br"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyDescription">Descrição da Empresa</Label>
          <Input
            id="companyDescription"
            type="text"
            placeholder="Ex: Especialista em soluções de marketing digital"
            value={form.companyDescription}
            onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="product">Produto ou Serviço</Label>
          <Input
            id="product"
            type="text"
            placeholder="Ex: Consultoria em Marketing Digital"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="objective">Objetivo</Label>
          <Input
            id="objective"
            type="text"
            placeholder="Ex: Aumentar conversões no site"
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Público-Alvo</Label>
          <Input
            id="targetAudience"
            type="text"
            placeholder="Ex: Empreendedores entre 30-45 anos"
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <Label>Plataformas*</Label>
          <div className="grid grid-cols-2 gap-4">
            {(["google", "meta", "linkedin", "microsoft"] as Platform[]).map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={form.platforms.includes(platform)}
                  onCheckedChange={() => handlePlatformToggle(platform)}
                />
                <Label htmlFor={platform} className="capitalize">
                  {platform === "meta" ? "Meta/Instagram" : `${platform} Ads`}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            "Gerar Anúncios"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
