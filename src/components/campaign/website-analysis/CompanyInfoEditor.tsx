
import React, { useMemo } from "react";
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
  
  // Industries based on language
  const industries = useMemo(() => {
    if (currentLanguage === 'pt' || analysisResult.language === 'pt') {
      return [
        "Tecnologia", "Finanças", "Saúde", "Educação", "Varejo", 
        "Manufatura", "Marketing", "Imobiliária", "Turismo", "Alimentação",
        "Serviços Profissionais", "Construção", "Entretenimento", "Energia", "Agricultura",
        "Software", "E-commerce", "Consultoria", "Automotivo", "Logística",
        "Telecomunicações", "Seguros", "Beleza e Estética", "Moda", "Esportes"
      ];
    } else if (currentLanguage === 'es' || analysisResult.language === 'es') {
      return [
        "Tecnología", "Finanzas", "Salud", "Educación", "Venta minorista", 
        "Manufactura", "Marketing", "Bienes raíces", "Turismo", "Alimentación",
        "Servicios Profesionales", "Construcción", "Entretenimiento", "Energía", "Agricultura",
        "Software", "Comercio electrónico", "Consultoría", "Automotriz", "Logística",
        "Telecomunicaciones", "Seguros", "Belleza y Estética", "Moda", "Deportes"
      ];
    } else {
      // Default to English
      return [
        "Technology", "Finance", "Healthcare", "Education", "Retail", 
        "Manufacturing", "Marketing", "Real Estate", "Travel", "Food & Beverage",
        "Professional Services", "Construction", "Entertainment", "Energy", "Agriculture",
        "Software", "E-commerce", "Consulting", "Automotive", "Logistics",
        "Telecommunications", "Insurance", "Beauty & Wellness", "Fashion", "Sports"
      ];
    }
  }, [currentLanguage, analysisResult.language]);

  // Common brand tone options with language support
  const brandTones = useMemo(() => {
    if (currentLanguage === 'pt' || analysisResult.language === 'pt') {
      return [
        "Profissional", "Amigável", "Autoritário", "Divertido", "Inovador",
        "Luxuoso", "Empático", "Educativo", "Inspirador", "Casual"
      ];
    } else if (currentLanguage === 'es' || analysisResult.language === 'es') {
      return [
        "Profesional", "Amigable", "Autoritario", "Divertido", "Innovador",
        "Lujoso", "Empático", "Educativo", "Inspirador", "Casual"
      ];
    } else {
      return [
        "Professional", "Friendly", "Authoritative", "Playful", "Innovative",
        "Luxurious", "Empathetic", "Educational", "Inspirational", "Casual"
      ];
    }
  }, [currentLanguage, analysisResult.language]);

  // Allow manual input if the industry is not in the predefined list
  const handleIndustryChange = (value: string) => {
    onTextChange('industry', value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="company-name" className="block text-sm font-medium mb-1">
          Company Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-name"
          value={analysisResult.companyName}
          onChange={(e) => onTextChange('companyName', e.target.value)}
          className="w-full"
          placeholder="Enter the company name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="business-description" className="block text-sm font-medium mb-1">
          Business Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="business-description"
          value={analysisResult.businessDescription || analysisResult.companyDescription || ''}
          onChange={(e) => {
            const value = e.target.value;
            onTextChange('businessDescription' as keyof WebsiteAnalysisResult, value);
            onTextChange('companyDescription' as keyof WebsiteAnalysisResult, value);
          }}
          className="w-full resize-none"
          rows={4}
          placeholder="Describe what the company does, its products/services, and unique selling points"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          This description is crucial for generating relevant ads - be specific and comprehensive
        </p>
      </div>
      
      <div>
        <Label htmlFor="industry" className="block text-sm font-medium mb-1">
          Industry / Segment <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {/* Industry dropdown with predefined options */}
          <Select
            value={industries.includes(analysisResult.industry) ? analysisResult.industry : ""}
            onValueChange={handleIndustryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select industry (${industries.length} options)`} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Allow custom input if not in the list */}
          <div className="mt-2">
            <Label htmlFor="custom-industry" className="text-xs text-muted-foreground">
              Or enter a custom industry if not in the list:
            </Label>
            <Input
              id="custom-industry"
              value={!industries.includes(analysisResult.industry) ? analysisResult.industry : ""}
              onChange={(e) => onTextChange('industry', e.target.value)}
              className="w-full mt-1"
              placeholder="Enter custom industry"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="brand-tone" className="block text-sm font-medium mb-1">
          Brand Tone
        </Label>
        <Select
          value={brandTones.includes(analysisResult.brandTone) ? analysisResult.brandTone : ""}
          onValueChange={(value) => onTextChange('brandTone' as keyof WebsiteAnalysisResult, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select brand tone" />
          </SelectTrigger>
          <SelectContent>
            {brandTones.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="mt-2"
          value={!brandTones.includes(analysisResult.brandTone) ? analysisResult.brandTone : ""}
          onChange={(e) => onTextChange('brandTone' as keyof WebsiteAnalysisResult, e.target.value)}
          placeholder="Or enter custom brand tone"
        />
      </div>
      
      <div>
        <Label htmlFor="target-audience" className="block text-sm font-medium mb-1">
          Target Audience <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="target-audience"
          value={analysisResult.targetAudience || ''}
          onChange={(e) => onTextChange('targetAudience' as keyof WebsiteAnalysisResult, e.target.value)}
          className="w-full resize-none"
          rows={3}
          placeholder="Describe the target audience demographics, interests, and pain points"
          required
        />
      </div>
    </div>
  );
};

export default CompanyInfoEditor;
