
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TriggerSelectorSection from './TriggerSelectorSection';

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
  const [activeTab, setActiveTab] = useState<string>(selectedPlatforms[0] || '');
  
  // Find the next platform tab that needs a trigger
  const findNextPlatformTab = (currentTab: string): string | null => {
    const currentIndex = selectedPlatforms.indexOf(currentTab);
    if (currentIndex === -1 || currentIndex >= selectedPlatforms.length - 1) {
      return null;
    }
    return selectedPlatforms[currentIndex + 1];
  };
  
  // Handle trigger selection and auto-advance to next tab if needed
  const handleTriggerChange = (platform: string, trigger: string) => {
    const updatedTriggers = { ...localTriggers, [platform]: trigger };
    setLocalTriggers(updatedTriggers);
    onTriggersChange(updatedTriggers);
    
    // Find and go to the next platform tab
    const nextTab = findNextPlatformTab(platform);
    if (nextTab) {
      setActiveTab(nextTab);
      // Scroll to top when changing tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Only call onNext when the Next button is explicitly clicked
  const handleNextClick = () => {
    onNext();
    // Scroll to top when proceeding to next step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Check if we have trigger selected for all platforms
  const allTriggersSelected = selectedPlatforms.every(platform => 
    localTriggers[platform] && localTriggers[platform].trim() !== '');
  
  // Get platform display name
  const getPlatformDisplayName = (platform: string): string => {
    switch (platform) {
      case 'google': return 'Google Ads';
      case 'meta': return 'Instagram Ads';
      case 'linkedin': return 'LinkedIn Ads';
      case 'microsoft': return 'Microsoft Ads';
      default: return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };
  
  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle>Choose Mind Triggers</CardTitle>
        <CardDescription>
          Select psychological triggers to enhance your ad copy for each platform.
          Different platforms respond better to different psychological approaches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          // Scroll to top when changing tabs
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <TabsList className="w-full mb-4">
            {selectedPlatforms.map(platform => (
              <TabsTrigger key={platform} value={platform} className="relative">
                {getPlatformDisplayName(platform)}
                {!localTriggers[platform] && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedPlatforms.map(platform => (
            <TabsContent key={platform} value={platform}>
              <TriggerSelectorSection
                title={getPlatformDisplayName(platform)}
                platform={platform}
                selected={localTriggers[platform] || ''}
                onSelect={(triggerId) => handleTriggerChange(platform, triggerId)}
              />
            </TabsContent>
          ))}
        </Tabs>
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
