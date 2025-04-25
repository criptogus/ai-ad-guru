
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CompanyInfoEditorProps {
  analysisResult: WebsiteAnalysisResult;
  onTextChange: (field: keyof WebsiteAnalysisResult, value: string) => void;
}

const CompanyInfoEditor: React.FC<CompanyInfoEditorProps> = ({
  analysisResult,
  onTextChange
}) => {
  const { currentLanguage } = useLanguage();
  const isPt = currentLanguage === 'pt';
  const isEs = currentLanguage === 'es';

  // Industry translations
  const industryTranslations: Record<string, { pt: string; es: string }> = {
    "education": { pt: "Educação", es: "Educación" },
    "healthcare": { pt: "Saúde", es: "Salud" },
    "technology": { pt: "Tecnologia", es: "Tecnología" },
    "finance": { pt: "Finanças", es: "Finanzas" },
    "retail": { pt: "Varejo", es: "Comercio Minorista" },
    "manufacturing": { pt: "Manufatura", es: "Manufactura" },
    "marketing": { pt: "Marketing", es: "Marketing" },
    "real estate": { pt: "Imobiliário", es: "Bienes Raíces" },
    "travel": { pt: "Viagens", es: "Viajes" },
    "food & beverage": { pt: "Alimentos e Bebidas", es: "Alimentos y Bebidas" },
    "consulting": { pt: "Consultoria", es: "Consultoría" },
    "entertainment": { pt: "Entretenimento", es: "Entretenimiento" },
    "energy": { pt: "Energia", es: "Energía" },
    "agriculture": { pt: "Agricultura", es: "Agricultura" },
    "arts": { pt: "Artes", es: "Artes" },
    "automotive": { pt: "Automotivo", es: "Automotriz" },
    "media": { pt: "Mídia", es: "Medios" },
    "pharmaceuticals": { pt: "Farmacêutica", es: "Farmacéutica" },
    "telecommunications": { pt: "Telecomunicações", es: "Telecomunicaciones" },
    "transportation": { pt: "Transporte", es: "Transporte" },
    "professional services": { pt: "Serviços Profissionais", es: "Servicios Profesionales" },
    "non-profit": { pt: "Sem Fins Lucrativos", es: "Sin Fines de Lucro" },
    "government": { pt: "Governo", es: "Gobierno" },
    "sports": { pt: "Esportes", es: "Deportes" },
    "fitness": { pt: "Fitness", es: "Fitness" },
    "beauty": { pt: "Beleza", es: "Belleza" },
    "fashion": { pt: "Moda", es: "Moda" }
  };

  // Get translated or original industries
  const industries = [
    "Education", "Healthcare", "Technology", "Finance", "Retail", 
    "Manufacturing", "Marketing", "Real Estate", "Travel", "Food & Beverage",
    "Consulting", "Entertainment", "Energy", "Agriculture", "Arts",
    "Automotive", "Media", "Pharmaceuticals", "Telecommunications", "Transportation",
    "Professional Services", "Non-Profit", "Government", "Sports", "Fitness",
    "Beauty", "Fashion"
  ];

  // Brand tone translations
  const toneTranslations: Record<string, { pt: string; es: string }> = {
    "professional": { pt: "Profissional", es: "Profesional" },
    "friendly": { pt: "Amigável", es: "Amigable" },
    "authoritative": { pt: "Autoritativo", es: "Autoritario" },
    "playful": { pt: "Divertido", es: "Juguetón" },
    "innovative": { pt: "Inovador", es: "Innovador" },
    "luxurious": { pt: "Luxuoso", es: "Lujoso" },
    "empathetic": { pt: "Empático", es: "Empático" },
    "educational": { pt: "Educacional", es: "Educativo" },
    "inspirational": { pt: "Inspirador", es: "Inspirador" },
    "casual": { pt: "Casual", es: "Casual" }
  };

  const brandTones = [
    "Professional", "Friendly", "Authoritative", "Playful", "Innovative",
    "Luxurious", "Empathetic", "Educational", "Inspirational", "Casual"
  ];

  // Translate label text
  const getLabel = (en: string, pt: string, es: string) => {
    if (isPt) return pt;
    if (isEs) return es;
    return en;
  };

  // Get item translation
  const getItemTranslation = (item: string, translations: Record<string, { pt: string; es: string }>) => {
    const lowerItem = item.toLowerCase();
    if (isPt && translations[lowerItem]) return translations[lowerItem].pt;
    if (isEs && translations[lowerItem]) return translations[lowerItem].es;
    return item;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="company-name" className="block text-sm font-medium mb-1">
          {getLabel("Company Name", "Nome da Empresa", "Nombre de la Empresa")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-name"
          value={analysisResult.companyName}
          onChange={(e) => onTextChange('companyName', e.target.value)}
          className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          placeholder={getLabel("Enter the company name", "Digite o nome da empresa", "Ingrese el nombre de la empresa")}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="business-description" className="block text-sm font-medium mb-1">
          {getLabel("Business Description", "Descrição do Negócio", "Descripción del Negocio")} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="business-description"
          value={analysisResult.businessDescription || analysisResult.companyDescription || ''}
          onChange={(e) => {
            const value = e.target.value;
            onTextChange('businessDescription', value);
            onTextChange('companyDescription' as keyof WebsiteAnalysisResult, value);
          }}
          className="w-full resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          rows={4}
          placeholder={getLabel(
            "Describe what the company does, its products/services, and unique selling points",
            "Descreva o que a empresa faz, seus produtos/serviços e diferenciais",
            "Describa qué hace la empresa, sus productos/servicios y puntos de venta únicos"
          )}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          {getLabel(
            "This description is crucial for generating relevant ads - be specific and comprehensive",
            "Esta descrição é crucial para gerar anúncios relevantes - seja específico e abrangente",
            "Esta descripción es crucial para generar anuncios relevantes - sea específico y completo"
          )}
        </p>
      </div>
      
      <div>
        <Label htmlFor="industry" className="block text-sm font-medium mb-1">
          {getLabel("Industry / Segment", "Indústria / Segmento", "Industria / Segmento")}
        </Label>
        <Select
          value={analysisResult.industry?.toLowerCase() || ''}
          onValueChange={(value) => onTextChange('industry', value)}
        >
          <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <SelectValue placeholder={getLabel("Select industry", "Selecione a indústria", "Seleccione la industria")} />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 max-h-[300px]">
            {industries.map((industry) => (
              <SelectItem key={industry.toLowerCase()} value={industry.toLowerCase()}>
                {isPt || isEs 
                  ? getItemTranslation(industry, industryTranslations) 
                  : industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {getLabel(
            "If the detected industry isn't correct, please select the most appropriate one",
            "Se a indústria detectada não estiver correta, selecione a mais apropriada",
            "Si la industria detectada no es correcta, seleccione la más apropiada"
          )}
        </p>
      </div>
      
      <div>
        <Label htmlFor="brand-tone" className="block text-sm font-medium mb-1">
          {getLabel("Brand Tone", "Tom da Marca", "Tono de Marca")}
        </Label>
        <Select
          value={analysisResult.brandTone?.toLowerCase() || ''}
          onValueChange={(value) => onTextChange('brandTone', value)}
        >
          <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <SelectValue placeholder={getLabel("Select brand tone", "Selecione o tom da marca", "Seleccione el tono de marca")} />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800">
            {brandTones.map((tone) => (
              <SelectItem key={tone.toLowerCase()} value={tone.toLowerCase()}>
                {isPt || isEs
                  ? getItemTranslation(tone, toneTranslations)
                  : tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="target-audience" className="block text-sm font-medium mb-1">
          {getLabel("Target Audience", "Público-Alvo", "Público Objetivo")} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="target-audience"
          value={analysisResult.targetAudience || ''}
          onChange={(e) => onTextChange('targetAudience', e.target.value)}
          className="w-full resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          rows={3}
          placeholder={getLabel(
            "Describe the target audience demographics, interests, and pain points",
            "Descreva a demografia, interesses e pontos de dor do público-alvo",
            "Describa la demografía, intereses y puntos dolor del público objetivo"
          )}
          required
        />
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
