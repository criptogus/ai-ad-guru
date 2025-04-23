
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface GenerateAdsProps {
  onNext: (ads: Record<string, any[]>, data: any) => void;
}

export const GenerateAds = ({ onNext }: GenerateAdsProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    websiteUrl: "",
    description: "",
    platform: "google", // Default platform
    objective: "sales", // Default objective
  });

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    
    // This is a mock implementation. In a real application, you would call an API
    // to generate the ads using OpenAI or another service.
    setTimeout(() => {
      // Mock generated ads
      const mockAds: Record<string, any[]> = {
        google: [
          {
            headline1: "Descubra " + form.companyName,
            headline2: "Soluções que transformam",
            headline3: "Comece hoje mesmo",
            description1: "Oferecemos as melhores soluções para sua empresa crescer.",
            description2: "Visite nosso site para saber mais.",
            finalUrl: form.websiteUrl,
          },
          {
            headline1: form.companyName + " - Qualidade",
            headline2: "Experimente agora",
            headline3: "Resultados garantidos",
            description1: "Soluções personalizadas para suas necessidades.",
            description2: "Entre em contato para mais informações.",
            finalUrl: form.websiteUrl,
          },
        ],
        meta: [
          {
            caption: "Descubra o que a " + form.companyName + " pode fazer por você! 🚀 Clique para saber mais.",
            primaryText: "Transforme seu negócio com nossas soluções inovadoras",
            heading: form.companyName + " - Inovação e qualidade",
            imageUrl: "https://via.placeholder.com/600x600?text=" + form.companyName,
          },
        ],
      };
      
      setLoading(false);
      onNext(mockAds, form);
    }, 2000);
  };

  const isFormValid = () => {
    return form.companyName.trim() !== "" && 
           form.websiteUrl.trim() !== "" && 
           form.description.trim() !== "";
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Gerar Anúncios</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input 
              id="companyName"
              value={form.companyName}
              onChange={(e) => updateForm("companyName", e.target.value)}
              placeholder="Ex: Minha Empresa"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input 
              id="websiteUrl"
              value={form.websiteUrl}
              onChange={(e) => updateForm("websiteUrl", e.target.value)}
              placeholder="Ex: https://minhaempresa.com.br"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição da Empresa</Label>
          <Textarea 
            id="description"
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder="Descreva seu produto ou serviço, diferenciais e público-alvo"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="platform">Plataforma</Label>
            <Select 
              value={form.platform} 
              onValueChange={(value) => updateForm("platform", value)}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plataformas</SelectItem>
                <SelectItem value="google">Google Ads</SelectItem>
                <SelectItem value="meta">Meta Ads (Facebook/Instagram)</SelectItem>
                <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                <SelectItem value="microsoft">Microsoft Ads</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo da Campanha</Label>
            <Select
              value={form.objective}
              onValueChange={(value) => updateForm("objective", value)}
            >
              <SelectTrigger id="objective">
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Reconhecimento de marca</SelectItem>
                <SelectItem value="consideration">Consideração</SelectItem>
                <SelectItem value="sales">Vendas/Conversões</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button
          onClick={handleGenerate}
          disabled={loading || !isFormValid()}
          className="w-full md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando anúncios...
            </>
          ) : (
            "Gerar anúncios com IA"
          )}
        </Button>
      </div>
    </Card>
  );
};
