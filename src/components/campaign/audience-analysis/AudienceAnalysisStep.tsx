
import React, { useState, useEffect } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis, AudienceAnalysisResult } from "@/hooks/useAudienceAnalysis";
import AudienceAnalysisPanel from "./AudienceAnalysisPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart3, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaign } from "@/contexts/CampaignContext";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudienceAnalysisStepProps {
  analysisResult: WebsiteAnalysisResult | null;
  onBack: () => void;
  onNext: (data?: any) => void;
}

const AudienceAnalysisStep: React.FC<AudienceAnalysisStepProps> = ({
  analysisResult,
  onBack,
  onNext
}) => {
  const { analyzeAudience, isAnalyzing, analysisResult: audienceResult, cacheInfo, setAnalysisResult, analysisError } = useAudienceAnalysis();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const { setAudienceAnalysisResult, setAudienceCacheInfo } = useCampaign();
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Initialize form for any form controls in AudienceAnalysisPanel
  const methods = useForm({
    defaultValues: {
      platform: "all"
    }
  });

  const handleAnalyze = async (platform?: string) => {
    if (!analysisResult) {
      setLocalError("É necessário ter os dados da análise do site");
      return;
    }
    
    setLocalError(null);
    setSelectedPlatform(platform || "all");
    
    try {
      const result = await analyzeAudience(analysisResult, platform);
      
      // Update the campaign context with the analysis result
      if (result) {
        setAudienceAnalysisResult(result);
        if (cacheInfo) {
          setAudienceCacheInfo(cacheInfo);
        }
      } else {
        setLocalError("Falha ao analisar público-alvo usando IA");
      }
    } catch (error) {
      console.error("Error analyzing audience:", error);
      setLocalError(error instanceof Error ? error.message : "Ocorreu um erro inesperado");
    }
  };

  // Run initial analysis when component mounts
  useEffect(() => {
    if (analysisResult && !audienceResult && !isAnalyzing) {
      handleAnalyze().catch(err => {
        console.error("Error in initial audience analysis:", err);
        setLocalError(err instanceof Error ? err.message : "Falha ao analisar público-alvo");
      });
    }
  }, [analysisResult, audienceResult, isAnalyzing]);

  const handleNextClick = () => {
    console.log("AudienceAnalysisStep: Next button clicked");
    console.log("Audience analysis result:", audienceResult);
    
    // Verificar se temos uma análise válida antes de prosseguir
    if (!audienceResult || !audienceResult.analysisText || audienceResult.analysisText.trim().length < 50) {
      setLocalError("É necessário ter uma análise de público-alvo válida para continuar");
      return;
    }
    
    // Pass the audience analysis data to the next step
    if (audienceResult) {
      const audienceData = {
        audienceAnalysis: audienceResult,
        audienceCacheInfo: cacheInfo
      };
      
      // Call onNext with the data 
      onNext(audienceData);
    } else {
      // If no analysis result yet, just proceed to next step
      onNext();
    }
  };

  const errorMessage = localError || analysisError;

  return (
    <FormProvider {...methods}>
      <Card className="shadow-md border border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Análise de Público-Alvo</CardTitle>
          </div>
          <CardDescription>
            Deixe nossa IA analisar o conteúdo do seu site para identificar o público perfeito para seus anúncios
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro na análise de público-alvo: {errorMessage}
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAnalyze(selectedPlatform)}
                    disabled={isAnalyzing}
                  >
                    Tentar novamente
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {analysisResult && (
            <AudienceAnalysisPanel
              websiteData={analysisResult}
              isAnalyzing={isAnalyzing}
              analysisResult={audienceResult}
              onAnalyze={handleAnalyze}
              selectedPlatform={selectedPlatform}
              cacheInfo={cacheInfo}
            />
          )}
          
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <Button variant="outline" onClick={onBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Etapa 4 de 7
            </span>
            
            <Button 
              onClick={handleNextClick} 
              className="flex items-center" 
              disabled={!audienceResult || isAnalyzing || !!errorMessage}
            >
              Próxima Etapa
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default AudienceAnalysisStep;
