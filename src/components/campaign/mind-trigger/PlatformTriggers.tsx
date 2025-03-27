
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TriggerSelector from './TriggerSelector';
import TemplateExamples from './TemplateExamples';
import CurrentSelectionDisplay from './CurrentSelectionDisplay';

interface PlatformTriggersProps {
  platform: string;
  selectedTrigger: string;
  onSelectTrigger: (trigger: string) => void;
}

const PlatformTriggers: React.FC<PlatformTriggersProps> = ({
  platform,
  selectedTrigger,
  onSelectTrigger
}) => {
  // Handle custom trigger addition without navigation
  const handleAddCustomTrigger = (value: string) => {
    if (value.trim()) {
      // Add a prefix to mark this as a custom trigger
      // Only update state, don't navigate
      onSelectTrigger(`custom:${value.trim()}`);
    }
  };

  // Handle template click without navigation
  const handleTemplateClick = (template: string) => {
    handleAddCustomTrigger(template);
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-4">
      <h3 className="text-lg font-medium mb-4">{getPlatformDisplayName(platform)}</h3>
      
      <Tabs defaultValue="trigger" className="w-full">
        <TabsContent value="trigger" className="space-y-4 mt-2">
          <TriggerSelector 
            platform={platform}
            selectedTrigger={selectedTrigger}
            onSelectTrigger={onSelectTrigger}
            onAddCustomTrigger={handleAddCustomTrigger}
          />
          
          <TemplateExamples 
            platform={platform}
            onSelectTemplate={handleTemplateClick}
          />
          
          <CurrentSelectionDisplay 
            platform={platform}
            selectedTrigger={selectedTrigger}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get display name for platforms
const getPlatformDisplayName = (platform: string): string => {
  switch (platform) {
    case 'google':
      return 'Google Ads';
    case 'meta':
      return 'Instagram/Meta Ads';
    case 'linkedin':
      return 'LinkedIn Ads';
    case 'microsoft':
      return 'Microsoft Ads';
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
};

export default PlatformTriggers;
