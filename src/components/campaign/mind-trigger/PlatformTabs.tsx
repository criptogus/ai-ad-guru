
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTriggerData } from "./useTriggerData";

interface PlatformTabsProps {
  selectedPlatforms: string[];
  activeTab: string;
}

const PlatformTabs: React.FC<PlatformTabsProps> = ({ 
  selectedPlatforms,
  activeTab
}) => {
  const { getPlatformDisplayName, getPlatformIcon } = useTriggerData();

  return (
    <TabsList className="mb-4 grid" style={{ gridTemplateColumns: `repeat(${selectedPlatforms.length}, 1fr)` }}>
      {selectedPlatforms.map(platform => (
        <TabsTrigger key={platform} value={platform} className="flex items-center gap-1.5">
          <span className="text-lg">{getPlatformIcon(platform)}</span>
          <span className="truncate">{getPlatformDisplayName(platform)}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default PlatformTabs;
