
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PlatformSelectionStepProps {
  campaignData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

const PlatformSelectionStep: React.FC<PlatformSelectionStepProps> = ({
  campaignData,
  onNext,
  onBack
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    campaignData.platforms || []
  );

  const platforms: Platform[] = [
    {
      id: "google",
      name: "Google Ads",
      description: "Anúncios de pesquisa para capturar intenção de busca",
      icon: "🔍"
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Anúncios visuais para engajamento e descoberta",
      icon: "📱"
    },
    {
      id: "facebook",
      name: "Facebook",
      description: "Alcance amplo e segmentação detalhada",
      icon: "👥"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Ideal para B2B e recrutamento",
      icon: "💼"
    },
    {
      id: "microsoft",
      name: "Microsoft Ads",
      description: "Rede de pesquisa alternativa com custos competitivos",
      icon: "🪟"
    }
  ];

  // Simulate AI recommendation based on industry
  useEffect(() => {
    const industry = campaignData.industry?.toLowerCase() || "";
    
    // Simple rule-based recommendation logic
    const updatedPlatforms = platforms.map(platform => {
      if (
        (industry.includes("b2b") && platform.id === "linkedin") ||
        (industry.includes("e-commerce") && platform.id === "google") ||
        (industry.includes("moda") && platform.id === "instagram") ||
        (industry.includes("varejo") && platform.id === "facebook")
      ) {
        return { ...platform, recommended: true };
      }
      return platform;
    });

    // This would be replaced with actual API call to get recommendations
    console.log("Updated platforms with recommendations:", updatedPlatforms);
  }, [campaignData.industry]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId) 
        : [...prev, platformId]
    );
  };

  const handleNext = () => {
    onNext({ platforms: selectedPlatforms });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seleção de Plataformas</h2>
      <p className="text-muted-foreground">
        Selecione as plataformas de anúncios para sua campanha. Nossa IA vai gerar anúncios otimizados para cada uma.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {platforms.map(platform => (
          <Card 
            key={platform.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedPlatforms.includes(platform.id) 
                ? "border-primary bg-primary/5" 
                : "border-border"
            }`}
            onClick={() => togglePlatform(platform.id)}
          >
            <div className="flex items-start">
              <div className="mr-4 text-3xl">{platform.icon}</div>
              <div className="flex-1">
                <div className="font-medium flex items-center">
                  {platform.name}
                  {platform.recommended && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{platform.description}</p>
              </div>
              <div className="ml-2">
                {selectedPlatforms.includes(platform.id) && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button 
          onClick={handleNext}
          disabled={selectedPlatforms.length === 0}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default PlatformSelectionStep;
