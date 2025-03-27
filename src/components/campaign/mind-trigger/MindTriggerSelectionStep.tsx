
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface MindTriggersData {
  google?: string;
  meta?: string;
  linkedin?: string;
  microsoft?: string;
}

export interface MindTriggerSelectionStepProps {
  selectedPlatforms: string[];
  selectedTriggers: MindTriggersData;
  onTriggersChange: (triggers: MindTriggersData) => void;
  onBack: () => void;
  onNext: (data?: { mindTriggers: MindTriggersData }) => void;
}

export const MindTriggerSelectionStep: React.FC<MindTriggerSelectionStepProps> = ({
  selectedPlatforms,
  selectedTriggers = {},
  onTriggersChange,
  onBack,
  onNext,
}) => {
  const [triggers, setTriggers] = useState<MindTriggersData>(selectedTriggers);
  const [activeTab, setActiveTab] = useState<string>("google");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Set initial active tab based on selected platforms
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activeTab]);

  const mindTriggers = {
    google: [
      { id: "authority", name: "Authority & Trust", description: "Convey expertise and credibility" },
      { id: "scarcity", name: "Scarcity & Urgency", description: "Create fear of missing out and prompt immediate action" },
      { id: "social", name: "Social Proof", description: "Use testimonials and reviews to build trust" },
      { id: "curiosity", name: "Curiosity", description: "Spark interest with intriguing questions or statements" },
      { id: "value", name: "Value Proposition", description: "Clearly state the benefit to the customer" }
    ],
    meta: [
      { id: "emotion", name: "Emotional Appeal", description: "Create an emotional connection with your audience" },
      { id: "storytelling", name: "Visual Storytelling", description: "Tell a compelling story with visuals" },
      { id: "aspiration", name: "Aspiration", description: "Show the ideal lifestyle your product enables" },
      { id: "before-after", name: "Before & After", description: "Demonstrate transformation and results" },
      { id: "authenticity", name: "Authenticity", description: "Show real people and genuine experiences" }
    ],
    linkedin: [
      { id: "professional", name: "Professional Value", description: "Focus on career advancement and professional growth" },
      { id: "industry", name: "Industry Insights", description: "Share valuable industry knowledge and trends" },
      { id: "networking", name: "Networking Opportunity", description: "Emphasize connection and relationship building" },
      { id: "expertise", name: "Thought Leadership", description: "Position your brand as an industry leader" },
      { id: "roi", name: "Business ROI", description: "Show concrete return on investment for businesses" }
    ],
    microsoft: [
      { id: "problem-solution", name: "Problem-Solution", description: "Identify a pain point and present your solution" },
      { id: "competitive", name: "Competitive Edge", description: "Highlight what makes you better than alternatives" },
      { id: "specific", name: "Specificity", description: "Use precise numbers, facts, and details" },
      { id: "prestige", name: "Prestige", description: "Associate with well-known brands or concepts" },
      { id: "future", name: "Future Value", description: "Emphasize long-term benefits and results" }
    ]
  };

  const handleTriggerSelect = (platform: string, triggerId: string) => {
    setTriggers(prev => ({
      ...prev,
      [platform]: triggerId
    }));
    
    onTriggersChange({
      ...triggers,
      [platform]: triggerId
    });
    
    setValidationError(null);
  };

  const handleNext = () => {
    // Validate that all selected platforms have a mind trigger
    const missingTriggers = selectedPlatforms.filter(platform => !triggers[platform as keyof MindTriggersData]);
    
    if (missingTriggers.length > 0) {
      setValidationError(`Please select mind triggers for ${missingTriggers.join(", ")}`);
      return;
    }
    
    onNext({ mindTriggers: triggers });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Mind Triggers</CardTitle>
        <CardDescription>
          Choose psychological triggers to make your ads more compelling for each platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              {selectedPlatforms.includes("google") && (
                <TabsTrigger value="google">Google Ads</TabsTrigger>
              )}
              {selectedPlatforms.includes("meta") && (
                <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
              )}
              {selectedPlatforms.includes("linkedin") && (
                <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
              )}
              {selectedPlatforms.includes("microsoft") && (
                <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
              )}
            </TabsList>

            {Object.entries(mindTriggers).map(([platform, platformTriggers]) => (
              <TabsContent key={platform} value={platform} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platformTriggers.map(trigger => (
                    <div
                      key={trigger.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        triggers[platform as keyof MindTriggersData] === trigger.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleTriggerSelect(platform, trigger.id)}
                    >
                      <h4 className="font-medium">{trigger.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trigger.description}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {validationError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
