
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface MindTriggerStepProps {
  campaignData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

interface MindTrigger {
  id: string;
  name: string;
  description: string;
  example: string;
  icon: string;
}

const MindTriggerStep: React.FC<MindTriggerStepProps> = ({
  campaignData,
  onNext,
  onBack
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState<string>(
    campaignData.mindTrigger || ""
  );

  const triggers: MindTrigger[] = [
    {
      id: "scarcity",
      name: "Escassez",
      description: "Criar senso de urgência destacando disponibilidade limitada",
      example: "Últimas vagas! Oferta por tempo limitado.",
      icon: "⏳"
    },
    {
      id: "social_proof",
      name: "Prova Social",
      description: "Mostrar que muitas pessoas já confiam e usam",
      example: "Mais de 10.000 clientes satisfeitos",
      icon: "👥"
    },
    {
      id: "authority",
      name: "Autoridade",
      description: "Estabelecer conhecimento especializado e credibilidade",
      example: "Desenvolvido pelos principais especialistas do setor",
      icon: "🏆"
    },
    {
      id: "reciprocity",
      name: "Reciprocidade",
      description: "Oferecer valor antecipadamente para criar desejo de retribuição",
      example: "Experimente grátis por 30 dias, sem compromisso",
      icon: "🎁"
    },
    {
      id: "consistency",
      name: "Consistência",
      description: "Alinhar com valores ou compromissos anteriores do público",
      example: "Continue sua jornada para uma vida mais saudável",
      icon: "🔄"
    },
    {
      id: "liking",
      name: "Empatia",
      description: "Criar conexão emocional e identificação com o público",
      example: "Criado por pessoas que enfrentaram os mesmos desafios que você",
      icon: "❤️"
    }
  ];

  const handleSelectTrigger = (triggerId: string) => {
    setSelectedTrigger(triggerId);
  };

  const handleNext = () => {
    onNext({ mindTrigger: selectedTrigger });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seleção de Gatilho Mental</h2>
      <p className="text-muted-foreground">
        Escolha um gatilho psicológico principal para seus anúncios. Isso ajudará nossa IA a criar
        textos mais persuasivos e eficazes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {triggers.map(trigger => (
          <Card 
            key={trigger.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTrigger === trigger.id 
                ? "border-primary bg-primary/5" 
                : "border-border"
            }`}
            onClick={() => handleSelectTrigger(trigger.id)}
          >
            <div className="flex items-start">
              <div className="mr-4 text-3xl">{trigger.icon}</div>
              <div className="flex-1">
                <div className="font-medium flex items-center justify-between">
                  {trigger.name}
                  {selectedTrigger === trigger.id && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{trigger.description}</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded-md italic">
                  "{trigger.example}"
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedTrigger}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default MindTriggerStep;
