
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoTabProps {
  campaignData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  campaignData,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          name="name"
          value={campaignData.name || ""}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Campaign Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          value={campaignData.description || ""}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUrl">Target URL</Label>
        <Input
          id="targetUrl"
          name="targetUrl"
          type="url"
          placeholder="https://example.com/landing-page"
          value={campaignData.targetUrl || ""}
          onChange={handleInputChange}
          required
        />
        <p className="text-xs text-muted-foreground">
          The landing page where users will be directed after clicking your ad
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Daily Budget ($)</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            min="5"
            value={campaignData.budget || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective">Campaign Objective</Label>
          <Select 
            value={campaignData.objective || ""} 
            onValueChange={(value) => handleSelectChange("objective", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an objective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="traffic">Website Traffic</SelectItem>
              <SelectItem value="conversions">Conversions</SelectItem>
              <SelectItem value="awareness">Brand Awareness</SelectItem>
              <SelectItem value="leads">Lead Generation</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="app_installs">App Installs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
