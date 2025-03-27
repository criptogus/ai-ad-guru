
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Brain, Zap, Crosshair, Award, Clock, Heart, ArrowRight } from "lucide-react";
import TriggerGallery from "./TriggerGallery";
import { useMentalTriggers } from "@/hooks/useMentalTriggers";
import { MentalTriggersSectionProps } from "@/types/campaign";

const MentalTriggersSection: React.FC<MentalTriggersSectionProps> = ({
  platform,
  activePlatform,
  onInsertTrigger,
  onSelectTrigger,
  mindTriggers = {}
}) => {
  const { insertTrigger, loadingTriggerField, setLoadingTriggerField } = useMentalTriggers();
  const activeTrigger = platform ? mindTriggers[platform] : (activePlatform ? mindTriggers[activePlatform] : undefined);
  const currentPlatform = platform || activePlatform || "google";

  // Define available triggers for this platform
  const availableTriggers = [
    "social_proof",
    "scarcity",
    "authority",
    "urgency",
    "reciprocity",
    "commitment",
    "curiosity",
    "value"
  ];

  // Define trigger icons
  const triggerIcons: Record<string, React.ReactNode> = {
    social_proof: <CheckCircle className="h-4 w-4" />,
    scarcity: <Clock className="h-4 w-4" />,
    authority: <Award className="h-4 w-4" />,
    urgency: <Zap className="h-4 w-4" />,
    reciprocity: <Heart className="h-4 w-4" />,
    commitment: <Crosshair className="h-4 w-4" />,
    curiosity: <Brain className="h-4 w-4" />,
    value: <ArrowRight className="h-4 w-4" />
  };

  // Get display name for a trigger
  const getTriggerDisplayName = (trigger: string): string => {
    return trigger
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSelectTrigger = (trigger: string) => {
    // Use the selected trigger
    if (onInsertTrigger) {
      onInsertTrigger(trigger);
    } else if (onSelectTrigger && currentPlatform) {
      onSelectTrigger(trigger, currentPlatform);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Mind Triggers</CardTitle>
        <CardDescription>
          Select a mental trigger to enhance your ad effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TriggerGallery 
          triggers={availableTriggers}
          activeTrigger={activeTrigger}
          onSelectTrigger={handleSelectTrigger}
          triggerIcons={triggerIcons}
        />
        
        {activeTrigger && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center">
            {triggerIcons[activeTrigger]}
            <span className="ml-2 font-medium">
              Using <span className="text-blue-600 dark:text-blue-400">
                {getTriggerDisplayName(activeTrigger)}
              </span> trigger
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
