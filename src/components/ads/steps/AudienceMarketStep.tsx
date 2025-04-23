
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudienceMarketStepProps {
  campaignData: any;
  analysisResult: any;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: (data: any) => void;
  onBack: () => void;
}

const AudienceMarketStep: React.FC<AudienceMarketStepProps> = ({
  campaignData,
  analysisResult,
  isGenerating,
  setIsGenerating,
  onNext,
  onBack
}) => {
  const [audienceData, setAudienceData] = useState({
    audienceProfile: campaignData.audienceProfile || "",
    geolocation: campaignData.geolocation || "",
    marketAnalysis: campaignData.marketAnalysis || "",
    competitorInsights: campaignData.competitorInsights || ""
  });
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Function to generate audience insights with AI
  const generateAudienceInsights = async () => {
    setIsGenerating(true);
    setAnalysisError(null);
    
    try {
      // If we already have audience analysis data, use that
      if (analysisResult?.audienceAnalysis?.analysisText) {
        const analysisText = analysisResult.audienceAnalysis.analysisText;
        
        // Check if the analysis text has the required sections
        if (!isValidAnalysisStructure(analysisText)) {
          setAnalysisError("A análise da OpenAI não contém as seções necessárias. Tente novamente ou preencha manualmente.");
          throw new Error("Invalid analysis structure from OpenAI");
        }
        
        // Extract sections from the analysis text
        const audienceProfile = extractSection(analysisText, 
          ["DETAILED TARGET AUDIENCE PROFILE", "PUBLIC TARGET PROFILE", "PERFIL DO PÚBLICO-ALVO", "PERFIL DETALLADO DEL PÚBLICO OBJETIVO"],
          ["STRATEGIC GEOLOCATION", "GEOLOCATION ANALYSIS", "GEOLOCALIZAÇÃO ESTRATÉGICA", "GEOLOCALIZACIÓN ESTRATÉGICA"]
        );
        
        const geolocation = extractSection(analysisText,
          ["STRATEGIC GEOLOCATION", "GEOLOCATION ANALYSIS", "GEOLOCALIZAÇÃO ESTRATÉGICA", "GEOLOCALIZACIÓN ESTRATÉGICA"],
          ["MARKET ANALYSIS", "ANÁLISE DE MERCADO", "ANÁLISIS DE MERCADO"]
        );
        
        const marketAnalysis = extractSection(analysisText,
          ["MARKET ANALYSIS", "ANÁLISE DE MERCADO", "ANÁLISIS DE MERCADO"],
          ["COMPETITIVE ANALYSIS", "COMPETITOR INSIGHTS", "ANÁLISE COMPETITIVA", "INSIGHTS DOS CONCORRENTES", "ANÁLISIS COMPETITIVO"]
        );
        
        const competitorInsights = extractSection(analysisText,
          ["COMPETITIVE ANALYSIS", "COMPETITOR INSIGHTS", "ANÁLISE COMPETITIVA", "INSIGHTS DOS CONCORRENTES", "ANÁLISIS COMPETITIVO"],
          []
        );
        
        // Validate that we have at least some content from the OpenAI response
        if (!audienceProfile && !geolocation && !marketAnalysis && !competitorInsights) {
          setAnalysisError("Não foi possível extrair informações válidas da análise da OpenAI");
          throw new Error("Failed to extract valid information from OpenAI analysis");
        }
        
        setAudienceData({
          audienceProfile: audienceProfile || campaignData.audienceProfile || "",
          geolocation: geolocation || campaignData.geolocation || "",
          marketAnalysis: marketAnalysis || campaignData.marketAnalysis || "",
          competitorInsights: competitorInsights || campaignData.competitorInsights || ""
        });
        
        toast.success("Insights de público gerados com sucesso!");
        return;
      }
      
      // If we don't have analysis data but have basic website data
      if (campaignData.websiteUrl || campaignData.businessDescription) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-targeting', {
            body: { 
              businessDescription: campaignData.businessDescription || campaignData.companyDescription || '',
              targetAudience: campaignData.targetAudience || ''
            }
          });
          
          if (error) throw new Error(error.message || 'Failed to generate targeting recommendations');
          
          if (data) {
            setAudienceData({
              audienceProfile: `Faixa etária: ${data.ageRange || '25-54'}, Gênero: ${translateGender(data.gender) || 'todos'}. ${campaignData.audienceProfile || ''}`,
              geolocation: data.locations || campaignData.geolocation || '',
              marketAnalysis: campaignData.marketAnalysis || '',
              competitorInsights: campaignData.competitorInsights || ''
            });
            
            toast.success("Recomendações de público-alvo geradas com sucesso!");
            return;
          }
        } catch (err) {
          console.error("Error generating targeting:", err);
          setAnalysisError("Falha ao gerar recomendações de público-alvo. Tente novamente ou preencha manualmente.");
        }
      } else {
        setAnalysisError("Dados insuficientes para gerar análise de público-alvo. Adicione uma descrição do negócio ou URL do site.");
      }
      
    } catch (error) {
      console.error("Error generating audience insights:", error);
      if (!analysisError) {
        setAnalysisError("Erro ao gerar insights de público-alvo.");
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to check if the analysis text has a valid structure
  const isValidAnalysisStructure = (text: string): boolean => {
    if (!text || typeof text !== 'string' || text.length < 100) {
      return false;
    }
    
    const upperText = text.toUpperCase();
    
    // Define expected section headers in different languages
    const expectedSections = [
      // English, Portuguese, Spanish
      ['PUBLIC TARGET PROFILE', 'PERFIL DO PÚBLICO-ALVO', 'PERFIL DETALLADO DEL PÚBLICO OBJETIVO', 'DETAILED TARGET AUDIENCE PROFILE'],
      ['GEOLOCATION ANALYSIS', 'GEOLOCALIZAÇÃO ESTRATÉGICA', 'GEOLOCALIZACIÓN ESTRATÉGICA', 'STRATEGIC GEOLOCATION'],
      ['MARKET ANALYSIS', 'ANÁLISE DE MERCADO', 'ANÁLISIS DE MERCADO'],
      ['COMPETITOR INSIGHTS', 'ANÁLISE COMPETITIVA', 'INSIGHTS DOS CONCORRENTES', 'ANÁLISIS COMPETITIVO', 'COMPETITIVE ANALYSIS']
    ];
    
    // Check if at least 2 of the expected sections are present
    let foundSections = 0;
    for (const sectionVariants of expectedSections) {
      if (sectionVariants.some(header => upperText.includes(header))) {
        foundSections++;
      }
    }
    
    return foundSections >= 2;
  };
  
  // Helper function to extract sections from analysis text
  const extractSection = (text: string, sectionHeaders: string[], nextSectionHeaders: string[]): string => {
    if (!text) return "";
    
    let startIndex = -1;
    let endIndex = text.length;
    const upperText = text.toUpperCase();
    
    // Find the start of the section
    for (const header of sectionHeaders) {
      const index = upperText.indexOf(header);
      if (index !== -1 && (startIndex === -1 || index < startIndex)) {
        startIndex = index;
      }
    }
    
    // Find the end of the section (start of next section)
    if (nextSectionHeaders.length > 0) {
      for (const header of nextSectionHeaders) {
        const index = upperText.indexOf(header);
        if (index !== -1 && index > startIndex && index < endIndex) {
          endIndex = index;
        }
      }
    }
    
    // If we found the section
    if (startIndex !== -1) {
      // Extract the section text
      const sectionText = text.substring(startIndex, endIndex).trim();
      
      // Remove the header from the section text
      const headerEndIndex = sectionText.indexOf("\n");
      if (headerEndIndex !== -1) {
        return sectionText.substring(headerEndIndex).trim();
      }
      return sectionText;
    }
    
    return "";
  };
  
  const translateGender = (gender: string): string => {
    if (!gender) return "todos";
    switch (gender.toLowerCase()) {
      case "male": return "masculino";
      case "female": return "feminino";
      case "all": return "todos";
      default: return gender;
    }
  };

  useEffect(() => {
    // If analysis result is available but no audience data has been set yet, 
    // auto-generate on component mount
    if ((analysisResult?.audienceAnalysis || campaignData?.websiteUrl) && 
        !audienceData.audienceProfile && !isGenerating) {
      generateAudienceInsights();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAudienceData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    onNext({
      audienceProfile: audienceData.audienceProfile,
      geolocation: audienceData.geolocation,
      marketAnalysis: audienceData.marketAnalysis,
      competitorInsights: audienceData.competitorInsights
    });
  };

  const isFormValid = audienceData.audienceProfile && audienceData.marketAnalysis;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Público-alvo & Análise de Mercado</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={generateAudienceInsights}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Gerar com IA
            </>
          )}
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Defina seu público-alvo e obtenha insights sobre o mercado. Nossa IA pode gerar sugestões
        baseadas na sua indústria e descrição do negócio.
      </p>

      {analysisError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 mt-6">
        <div>
          <label htmlFor="audienceProfile" className="block text-sm font-medium mb-1">
            Perfil do Público-alvo
          </label>
          <Textarea
            id="audienceProfile"
            name="audienceProfile"
            value={audienceData.audienceProfile}
            onChange={handleInputChange}
            placeholder="Descreva seu público-alvo ideal: idade, interesses, comportamentos, etc."
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor="geolocation" className="block text-sm font-medium mb-1">
            Geolocalização
          </label>
          <Textarea
            id="geolocation"
            name="geolocation"
            value={audienceData.geolocation}
            onChange={handleInputChange}
            placeholder="Regiões geográficas que deseja alcançar"
            rows={2}
          />
        </div>
        
        <div>
          <label htmlFor="marketAnalysis" className="block text-sm font-medium mb-1">
            Análise de Mercado
          </label>
          <Textarea
            id="marketAnalysis"
            name="marketAnalysis"
            value={audienceData.marketAnalysis}
            onChange={handleInputChange}
            placeholder="Tendências relevantes do mercado e oportunidades"
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor="competitorInsights" className="block text-sm font-medium mb-1">
            Insights sobre Concorrentes
          </label>
          <Textarea
            id="competitorInsights"
            name="competitorInsights"
            value={audienceData.competitorInsights}
            onChange={handleInputChange}
            placeholder="Pontos fortes e fracos dos concorrentes, seu diferencial"
            rows={3}
          />
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button 
          onClick={handleNext}
          disabled={!isFormValid}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default AudienceMarketStep;
