
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedSettingsTabProps {
  campaignData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({
  campaignData,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bidStrategy">Bid Strategy</Label>
        <Select 
          value={campaignData.bidStrategy || "maximize_conversions"} 
          onValueChange={(value) => handleSelectChange("bidStrategy", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bid strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maximize_conversions">Maximize Conversions</SelectItem>
            <SelectItem value="maximize_clicks">Maximize Clicks</SelectItem>
            <SelectItem value="target_cpa">Target CPA</SelectItem>
            <SelectItem value="target_roas">Target ROAS</SelectItem>
            <SelectItem value="manual_cpc">Manual CPC</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          How Google Ads will optimize your bidding
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={campaignData.startDate || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={campaignData.endDate || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exclusions">Keyword Exclusions (Optional)</Label>
        <Textarea
          id="exclusions"
          name="exclusions"
          rows={2}
          placeholder="Enter keywords to exclude, separated by commas"
          value={campaignData.exclusions || ""}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">
          Keywords you want to exclude from your targeting
        </p>
      </div>
    </div>
  );
};

export default AdvancedSettingsTab;
