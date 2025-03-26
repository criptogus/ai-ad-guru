
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformTabsProps {
  selectedPlatforms: string[];
  activeTab: string;
}

const PlatformTabs: React.FC<PlatformTabsProps> = ({ 
  selectedPlatforms,
  activeTab
}) => {
  const getCurrentPlatformName = (id: string) => {
    switch(id) {
      case "google": return "Google Ads";
      case "meta": return "Instagram/Meta Ads";
      case "linkedin": return "LinkedIn Ads";
      case "microsoft": return "Microsoft Ads";
      default: return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  return (
    <TabsList className="mb-4 grid" style={{ gridTemplateColumns: `repeat(${selectedPlatforms.length}, 1fr)` }}>
      {selectedPlatforms.map(platform => (
        <TabsTrigger key={platform} value={platform}>
          {getCurrentPlatformName(platform)}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default PlatformTabs;
