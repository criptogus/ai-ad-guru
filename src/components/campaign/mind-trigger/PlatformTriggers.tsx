
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TriggerSelectorSection from './TriggerSelectorSection';
import PlatformTabs from './PlatformTabs';

interface PlatformTriggersProps {
  selectedPlatforms: string[];
  selectedTriggers: Record<string, string>;
  onTriggerChange: (platform: string, trigger: string) => void;
}

const PlatformTriggers: React.FC<PlatformTriggersProps> = ({
  selectedPlatforms,
  selectedTriggers,
  onTriggerChange
}) => {
  const [activeTab, setActiveTab] = React.useState<string>(selectedPlatforms[0] || '');

  // Set initial active tab when platforms are loaded
  React.useEffect(() => {
    if (selectedPlatforms.length > 0 && !activeTab) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activeTab]);

  if (!activeTab) return null;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <PlatformTabs 
          selectedPlatforms={selectedPlatforms} 
          activeTab={activeTab}
        />
        
        {selectedPlatforms.map(platform => (
          <TabsContent key={platform} value={platform} className="space-y-6">
            <TriggerSelectorSection 
              platform={platform}
              title={getPlatformDisplayName(platform)}
              selected={selectedTriggers[platform] || ''}
              onSelect={(trigger) => onTriggerChange(platform, trigger)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Helper function to get platform display name
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
