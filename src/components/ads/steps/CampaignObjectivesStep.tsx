
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface CampaignObjectivesStepProps {
  campaignData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const CampaignObjectivesStep: React.FC<CampaignObjectivesStepProps> = ({
  campaignData,
  onNext,
  onBack
}) => {
  const [objectives, setObjectives] = useState({
    campaignGoal: campaignData.campaignGoal || "awareness",
    startDate: campaignData.startDate || getTodayDate(),
    endDate: campaignData.endDate || "",
    budget: campaignData.budget || {}
  });

  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setObjectives(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (value: string) => {
    setObjectives(prev => ({ ...prev, campaignGoal: value }));
  };

  const handleBudgetChange = (platform: string, value: string) => {
    setObjectives(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [platform]: parseFloat(value) || 0
      }
    }));
  };

  const handleNext = () => {
    onNext({
      campaignGoal: objectives.campaignGoal,
      startDate: objectives.startDate,
      endDate: objectives.endDate,
      budget: objectives.budget
    });
  };

  // Get selected platforms from campaign data
  const selectedPlatforms = campaignData.platforms || [];

  const isFormValid = () => {
    // Check if campaign goal is selected
    if (!objectives.campaignGoal) return false;
    
    // Check if dates are valid
    if (!objectives.startDate) return false;
    
    // Check if each selected platform has a budget
    return selectedPlatforms.every(
      (platform: string) => 
        objectives.budget[platform] !== undefined && 
        objectives.budget[platform] > 0
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Objetivos da Campanha</h2>
      <p className="text-muted-foreground">
        Defina os objetivos, período e orçamento para sua campanha de anúncios.
      </p>

      <div className="space-y-6 mt-6">
        <div>
          <h3 className="text-base font-medium mb-3">Objetivo principal</h3>
          <RadioGroup 
            value={objectives.campaignGoal}
            onValueChange={handleGoalChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="awareness" id="awareness" />
              <Label htmlFor="awareness" className="cursor-pointer">Reconhecimento de marca</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="consideration" id="consideration" />
              <Label htmlFor="consideration" className="cursor-pointer">Consideração</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="conversion" id="conversion" />
              <Label htmlFor="conversion" className="cursor-pointer">Conversão</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Data de Início
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={objectives.startDate}
              onChange={handleInputChange}
              min={getTodayDate()}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              Data de Término (opcional)
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={objectives.endDate}
              onChange={handleInputChange}
              min={objectives.startDate || getTodayDate()}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium mb-3">Orçamento diário por plataforma</h3>
          <div className="space-y-2">
            {selectedPlatforms.map((platform: string) => (
              <div key={platform} className="flex items-center gap-3">
                <div className="w-32">{getPlatformName(platform)}:</div>
                <div className="flex-1 flex items-center">
                  <span className="mr-2">R$</span>
                  <Input
                    type="number"
                    min="10"
                    step="5"
                    value={objectives.budget[platform] || ""}
                    onChange={(e) => handleBudgetChange(platform, e.target.value)}
                    placeholder="50"
                  />
                  <span className="ml-2">/dia</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button 
          onClick={handleNext}
          disabled={!isFormValid()}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

// Helper function to get platform display name
function getPlatformName(platformId: string): string {
  const platforms: Record<string, string> = {
    google: "Google Ads",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    microsoft: "Microsoft Ads"
  };
  
  return platforms[platformId] || platformId;
}

export default CampaignObjectivesStep;
