
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Zap, LineChart } from "lucide-react";

interface ControlsSectionProps {
  selectedGoal: string;
  setSelectedGoal: (value: string) => void;
  previewMode: string;
  setPreviewMode: (value: string) => void;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  selectedGoal,
  setSelectedGoal,
  previewMode,
  setPreviewMode,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div className="space-y-1 w-full md:w-1/2">
        <p className="text-sm font-medium">Optimization Goal</p>
        <Select
          value={selectedGoal}
          onValueChange={setSelectedGoal}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clicks">
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                <span>Optimize for Clicks</span>
              </div>
            </SelectItem>
            <SelectItem value="conversions">
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                <span>Maximize Conversions</span>
              </div>
            </SelectItem>
            <SelectItem value="cpa">
              <div className="flex items-center">
                <LineChart className="mr-2 h-4 w-4" />
                <span>Lower CPA</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1 w-full md:w-1/2">
        <p className="text-sm font-medium">Preview Mode</p>
        <Select
          value={previewMode}
          onValueChange={setPreviewMode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select preview mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile">Mobile Feed</SelectItem>
            <SelectItem value="desktop">Desktop News Feed</SelectItem>
            <SelectItem value="sidebar">Right Column</SelectItem>
            <SelectItem value="search">Search Results</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
