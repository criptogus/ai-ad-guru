
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlatformTabs from "./PlatformTabs";
import TriggerSelector from "./TriggerSelector";
import TemplateExamples from "./TemplateExamples";
import CurrentSelectionDisplay from "./CurrentSelectionDisplay";

interface MindTriggerSelectionStepProps {
  selectedPlatforms: string[];
  selectedTriggers: Record<string, string>;
  onTriggersChange: (triggers: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}

const MindTriggerSelectionStep: React.FC<MindTriggerSelectionStepProps> = ({
  selectedPlatforms,
  selectedTriggers,
  onTriggersChange,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = React.useState(selectedPlatforms[0] || "google");
  const [customTrigger, setCustomTrigger] = React.useState("");

  const handleSelectTemplate = (template: string) => {
    setCustomTrigger(template);
    // If we want to automatically add it as a custom trigger
    const updatedTriggers = { ...selectedTriggers };
    updatedTriggers[activeTab] = `custom:${template.trim()}`;
    onTriggersChange(updatedTriggers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Mind Triggers & Templates</CardTitle>
        <CardDescription>
          Mind triggers are psychological concepts that make your ads more effective and persuasive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <PlatformTabs 
            selectedPlatforms={selectedPlatforms} 
            activeTab={activeTab}
          />

          {selectedPlatforms.map(platform => (
            <TabsContent key={platform} value={platform} className="space-y-4">
              <TriggerSelector 
                platform={platform}
                selectedTrigger={selectedTriggers[platform] || ""}
                onSelectTrigger={(value) => {
                  const updatedTriggers = { ...selectedTriggers };
                  updatedTriggers[platform] = value;
                  onTriggersChange(updatedTriggers);
                }}
                onAddCustomTrigger={(customTrigger) => {
                  if (customTrigger.trim()) {
                    const updatedTriggers = { ...selectedTriggers };
                    updatedTriggers[platform] = `custom:${customTrigger.trim()}`;
                    onTriggersChange(updatedTriggers);
                  }
                }}
              />

              <TemplateExamples 
                platform={platform} 
                onSelectTemplate={handleSelectTemplate}
              />

              <CurrentSelectionDisplay 
                platform={platform}
                selectedTrigger={selectedTriggers[platform] || ""}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="pt-6 mt-6 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={selectedPlatforms.some(platform => !selectedTriggers[platform])}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MindTriggerSelectionStep;
