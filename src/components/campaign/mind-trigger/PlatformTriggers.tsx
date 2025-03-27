
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TriggerSelector from './TriggerSelector';
import TemplateExamples from './TemplateExamples';
import CurrentSelectionDisplay from './CurrentSelectionDisplay';
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

  // Handle custom trigger addition without navigation
  const handleAddCustomTrigger = (value: string) => {
    if (value.trim() && activeTab) {
      // Add a prefix to mark this as a custom trigger
      onTriggerChange(activeTab, `custom:${value.trim()}`);
    }
  };

  // Handle template click without navigation
  const handleTemplateClick = (template: string) => {
    handleAddCustomTrigger(template);
  };

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
            <TriggerSelector 
              platform={platform}
              selectedTrigger={selectedTriggers[platform] || ''}
              onSelectTrigger={(trigger) => onTriggerChange(platform, trigger)}
              onAddCustomTrigger={(value) => onTriggerChange(platform, `custom:${value.trim()}`)}
            />
            
            <TemplateExamples 
              platform={platform}
              onSelectTemplate={handleTemplateClick}
            />
            
            <CurrentSelectionDisplay 
              platform={platform}
              selectedTrigger={selectedTriggers[platform] || ''}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PlatformTriggers;
