
import React from "react";
import { AudienceAnalysisResult as AudienceResult } from "@/hooks/useAudienceAnalysis";
import EditableAnalysisText from "./EditableAnalysisText";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  // Verify if we have a real OpenAI analysis or a generic placeholder
  const isValidAnalysis = () => {
    if (!analysisResult?.analysisText || analysisResult.analysisText.length < 100) {
      return false;
    }
    
    const analysisText = analysisResult.analysisText.toUpperCase();
    
    // Check for required sections in different languages
    const requiredSections = [
      // Combinations of different possible section headers in different languages
      ['PUBLIC TARGET PROFILE', 'PERFIL DO PÚBLICO-ALVO', 'PERFIL DETALLADO DEL PÚBLICO OBJETIVO'],
      ['GEOLOCATION ANALYSIS', 'ANÁLISE DE GEOLOCALIZAÇÃO', 'GEOLOCALIZACIÓN ESTRATÉGICA'],
      ['MARKET ANALYSIS', 'ANÁLISE DE MERCADO', 'ANÁLISIS DE MERCADO'],
      ['COMPETITOR INSIGHTS', 'INSIGHTS DOS CONCORRENTES', 'ANÁLISE COMPETITIVA', 'ANÁLISIS COMPETITIVO']
    ];
    
    // Count how many of the required sections are found
    const foundSections = requiredSections.filter(sectionOptions => 
      sectionOptions.some(header => analysisText.includes(header))
    ).length;
    
    // Valid if at least 2 of the 4 section types are found
    return foundSections >= 2;
  };
  
  const isGenericText = !isValidAnalysis();
  
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
      // Portuguese
      .replace(/1\.\s*PERFIL DO PÚBLICO-ALVO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">PERFIL DO PÚBLICO-ALVO</h2>')
      .replace(/2\.\s*ANÁLISE DE GEOLOCALIZAÇÃO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISE DE GEOLOCALIZAÇÃO</h2>')
      .replace(/2\.\s*GEOLOCALIZAÇÃO ESTRATÉGICA/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">GEOLOCALIZAÇÃO ESTRATÉGICA</h2>')
      .replace(/3\.\s*ANÁLISE DE MERCADO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISE DE MERCADO</h2>')
      .replace(/4\.\s*ANÁLISE COMPETITIVA/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISE COMPETITIVA</h2>')
      .replace(/4\.\s*INSIGHTS DOS CONCORRENTES/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">INSIGHTS DOS CONCORRENTES</h2>')
               
      // English
      .replace(/1\.\s*PUBLIC TARGET PROFILE/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">PUBLIC TARGET PROFILE</h2>')
      .replace(/1\.\s*DETAILED TARGET AUDIENCE PROFILE/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">DETAILED TARGET AUDIENCE PROFILE</h2>')
      .replace(/2\.\s*GEOLOCATION ANALYSIS/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">GEOLOCATION ANALYSIS</h2>')
      .replace(/2\.\s*STRATEGIC GEOLOCATION/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">STRATEGIC GEOLOCATION</h2>')
      .replace(/3\.\s*MARKET ANALYSIS/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">MARKET ANALYSIS</h2>')
      .replace(/4\.\s*COMPETITIVE ANALYSIS/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">COMPETITIVE ANALYSIS</h2>')
      .replace(/4\.\s*COMPETITOR INSIGHTS/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">COMPETITOR INSIGHTS</h2>')
               
      // Spanish
      .replace(/1\.\s*PERFIL DETALLADO DEL PÚBLICO OBJETIVO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">PERFIL DETALLADO DEL PÚBLICO OBJETIVO</h2>')
      .replace(/2\.\s*GEOLOCALIZACIÓN ESTRATÉGICA/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">GEOLOCALIZACIÓN ESTRATÉGICA</h2>')
      .replace(/3\.\s*ANÁLISIS DE MERCADO/gi, 
               '<h2 class="text-xl font-bold mt-5 mb-3 text-primary">ANÁLISIS DE MERCADO</h2>')
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
          <AlertTitle>Formato de análise inválido</AlertTitle>
          <AlertDescription>
            A resposta da OpenAI não contém as seções de análise necessárias ou está incompleta. 
            Por favor, tente novamente ou preencha as informações manualmente.
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
