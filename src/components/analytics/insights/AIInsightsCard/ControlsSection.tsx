
import React from "react";

interface ControlsSectionProps {
  selectedPlatform: string;
  onPlatformChange: (value: string) => void;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  selectedPlatform,
  onPlatformChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div className="space-y-1 w-full md:w-1/2">
        <p className="text-sm font-medium">Platform</p>
        <select 
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="google">Google Ads</option>
          <option value="meta">Meta Ads</option>
          <option value="microsoft">Microsoft Ads</option>
        </select>
      </div>
    </div>
  );
};
