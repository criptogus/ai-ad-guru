
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import { PlatformTriggers } from './index';

interface MindTriggerSelectionStepProps {
  selectedPlatforms: string[];
  selectedTriggers: Record<string, string>;
  onTriggersChange: (triggers: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const MindTriggerSelectionStep: React.FC<MindTriggerSelectionStepProps> = ({
  selectedPlatforms,
  selectedTriggers,
  onTriggersChange,
  onBack,
  onNext
}) => {
  const [localTriggers, setLocalTriggers] = useState<Record<string, string>>(selectedTriggers);
  
  // This function will ONLY update the state, never trigger navigation
  const handleTriggerChange = (platform: string, trigger: string) => {
    const updatedTriggers = { ...localTriggers, [platform]: trigger };
    setLocalTriggers(updatedTriggers);
    onTriggersChange(updatedTriggers);
  };
  
  // Only call onNext when the Next button is explicitly clicked
  const handleNextClick = () => {
    onNext();
  };
  
  // Check if we have trigger selected for all platforms
  const allTriggersSelected = selectedPlatforms.every(platform => 
    localTriggers[platform] && localTriggers[platform].trim() !== '');
  
  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle>Choose Mind Triggers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-muted-foreground mb-2">
          Select psychological triggers to enhance your ad copy for each platform
        </div>
        
        {selectedPlatforms.map(platform => (
          <PlatformTriggers
            key={platform}
            platform={platform}
            selectedTrigger={localTriggers[platform] || ''}
            onSelectTrigger={(trigger) => handleTriggerChange(platform, trigger)}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={onBack}
          variant="outline"
          type="button"
        >
          Back
        </Button>
        <Button 
          onClick={handleNextClick}
          disabled={!allTriggersSelected}
          type="button"
        >
          Next Step <MoveRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
