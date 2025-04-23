
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Sparkles } from "lucide-react";
import { toast } from "sonner";

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

  // Function to generate audience insights with AI
  const generateAudienceInsights = async () => {
    setIsGenerating(true);
    
    try {
      // This would be a real API call in production
      // For now, we'll simulate the AI generation
      
      // Wait for a brief period to simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedInsights = {
        audienceProfile: generateAudienceProfile(),
        geolocation: generateGeolocation(),
        marketAnalysis: generateMarketAnalysis(),
        competitorInsights: generateCompetitorInsights()
      };
      
      setAudienceData(generatedInsights);
      toast.success("Insights de público gerados com sucesso!");
      
    } catch (error) {
      console.error("Error generating audience insights:", error);
      toast.error("Erro ao gerar insights de público.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper functions to generate sample content based on campaign data
  const generateAudienceProfile = () => {
    const industry = campaignData.industry || "";
    const businessType = campaignData.businessType || "";
    
    if (industry.toLowerCase().includes("marketing")) {
      return "Profissionais de marketing entre 25-45 anos, gerentes e diretores de marketing, pequenos empresários que buscam aumentar sua presença digital. Possuem conhecimento intermediário em marketing digital e estão interessados em melhorar seu ROI.";
    } else {
      return `Pessoas interessadas em ${industry}, com poder de decisão de compra, faixa etária de 25-55 anos, que valorizam qualidade e resultados comprovados. Buscam soluções para otimizar seus processos e aumentar sua eficiência.`;
    }
  };
  
  const generateGeolocation = () => {
    return "Principais capitais do Brasil, com foco em São Paulo, Rio de Janeiro, Belo Horizonte, Brasília e Porto Alegre. Áreas urbanas com alta concentração de empresas e profissionais do setor.";
  };
  
  const generateMarketAnalysis = () => {
    const industry = campaignData.industry || "";
    return `O mercado de ${industry} está em crescimento constante, com taxa média de 8% ao ano. Há uma tendência crescente de digitalização e automação. Os clientes estão cada vez mais exigentes quanto à qualidade dos serviços e buscam parceiros que ofereçam soluções completas e personalizadas.`;
  };
  
  const generateCompetitorInsights = () => {
    return "Os principais concorrentes focam em preço baixo, mas frequentemente comprometem a qualidade. Existe uma oportunidade para se destacar oferecendo serviços premium com resultados mensuráveis. A maioria dos concorrentes não oferece suporte contínuo após a venda, o que pode ser um diferencial competitivo.";
  };

  useEffect(() => {
    // If analysis result is available but no audience data has been set yet, 
    // auto-generate on component mount
    if (analysisResult && !audienceData.audienceProfile) {
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
