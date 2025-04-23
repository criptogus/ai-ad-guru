
import React from "react";
import { AudienceAnalysisResult as AudienceResult } from "@/hooks/useAudienceAnalysis";
import EditableAnalysisText from "./EditableAnalysisText";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudienceAnalysisResultProps {
  analysisResult: AudienceResult;
  onTextChange?: (text: string) => void;
  platform?: string;
  websiteData?: any;
  isAnalyzing?: boolean;
}

const AudienceAnalysisResult: React.FC<AudienceAnalysisResultProps> = ({
  analysisResult,
  onTextChange,
  platform,
  websiteData,
  isAnalyzing
}) => {
  // Validar se temos uma análise real da OpenAI ou um placeholder genérico
  const isGenericText = !analysisResult?.analysisText || 
    analysisResult.analysisText.length < 50 ||
    (!analysisResult.analysisText.includes('PÚBLICO-ALVO') && 
     !analysisResult.analysisText.includes('TARGET AUDIENCE') && 
     !analysisResult.analysisText.includes('PERFIL DETALLADO'));
  
  // Format analysis text as HTML if it contains markdown-like syntax
  const formatAnalysisText = (text: string) => {
    if (!text) return '';
    
    // Replace markdown-like headers with HTML
    let formattedText = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      
      // Replace bullet points with HTML lists
      .replace(/^\*\s(.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\-\s(.*$)/gim, '<li class="ml-4">$1</li>')
      
      // Replace numbered lists
      .replace(/^\d+\.\s(.*$)/gim, '<li class="ml-4">$1</li>');
    
    // Replace sections specifically for our audience analysis
    formattedText = formattedText
      .replace(/1\.\s*PERFIL DO PÚBLICO-ALVO DETALHADO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">PERFIL DO PÚBLICO-ALVO DETALHADO</h2>')
      .replace(/1\.\s*DETAILED TARGET AUDIENCE PROFILE/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">DETAILED TARGET AUDIENCE PROFILE</h2>')
      .replace(/1\.\s*PERFIL DETALLADO DEL PÚBLICO OBJETIVO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">PERFIL DETALLADO DEL PÚBLICO OBJETIVO</h2>')
               
      .replace(/2\.\s*GEOLOCALIZAÇÃO ESTRATÉGICA/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">GEOLOCALIZAÇÃO ESTRATÉGICA</h2>')
      .replace(/2\.\s*STRATEGIC GEOLOCATION/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">STRATEGIC GEOLOCATION</h2>')
      .replace(/2\.\s*GEOLOCALIZACIÓN ESTRATÉGICA/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">GEOLOCALIZACIÓN ESTRATÉGICA</h2>')
               
      .replace(/3\.\s*ANÁLISE DE MERCADO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISE DE MERCADO</h2>')
      .replace(/3\.\s*MARKET ANALYSIS/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">MARKET ANALYSIS</h2>')
      .replace(/3\.\s*ANÁLISIS DE MERCADO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISIS DE MERCADO</h2>')
               
      .replace(/4\.\s*ANÁLISE COMPETITIVA/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISE COMPETITIVA</h2>')
      .replace(/4\.\s*COMPETITIVE ANALYSIS/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">COMPETITIVE ANALYSIS</h2>')
      .replace(/4\.\s*ANÁLISIS COMPETITIVO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISIS COMPETITIVO</h2>');

    // Add paragraph tags to text that isn't already wrapped in HTML
    const lines = formattedText.split('\n');
    formattedText = lines.map(line => {
      if (line.trim() === '') return '';
      if (line.trim().startsWith('<')) return line;
      return `<p class="mb-2">${line}</p>`;
    }).join('');
    
    // Replace bold text markers with span elements
    formattedText = formattedText
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
      .replace(/__(.*?)__/g, '<span class="font-bold">$1</span>');
    
    return formattedText;
  };

  // Extract the analysis text from the result
  const analysisText = analysisResult?.analysisText || "";
  const formattedText = formatAnalysisText(analysisText);

  // Handle text changes if the component is editable
  const handleTextChange = (newText: string) => {
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  return (
    <div className="space-y-4">
      {isAnalyzing ? (
        <div className="p-4 border rounded-md bg-muted animate-pulse">
          <div className="h-6 w-1/3 bg-muted-foreground/20 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-4/6"></div>
          </div>
        </div>
      ) : isGenericText ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não foi possível obter uma análise de público-alvo válida da OpenAI. Por favor, tente novamente ou preencha manualmente.
          </AlertDescription>
        </Alert>
      ) : (
        <EditableAnalysisText 
          text={analysisText} 
          formattedHtml={formattedText}
          onSave={handleTextChange}
        />
      )}
    </div>
  );
};

export default AudienceAnalysisResult;
