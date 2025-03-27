
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoCircle } from "lucide-react";
import { FormError } from "./FormError";

interface BasicInfoTabProps {
  campaignData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: Record<string, string | null>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  campaignData,
  handleInputChange,
  handleSelectChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center">
          Campaign Name <span className="text-red-500 ml-1">*</span>
          <div className="ml-2 text-muted-foreground hover:text-foreground cursor-help">
            <InfoCircle className="h-4 w-4" />
          </div>
        </Label>
        <Input
          id="name"
          name="name"
          value={campaignData.name || ""}
          onChange={handleInputChange}
          className={errors.name ? "border-red-500" : ""}
        />
        <FormError error={errors.name} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center">
          Campaign Description <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          value={campaignData.description || ""}
          onChange={handleInputChange}
          className={errors.description ? "border-red-500" : ""}
        />
        <FormError error={errors.description} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUrl" className="flex items-center">
          Target URL <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="targetUrl"
          name="targetUrl"
          type="url"
          placeholder="https://example.com/landing-page"
          value={campaignData.targetUrl || ""}
          onChange={handleInputChange}
          className={errors.targetUrl ? "border-red-500" : ""}
        />
        <FormError error={errors.targetUrl} />
        <p className="text-xs text-muted-foreground">
          The landing page where users will be directed after clicking your ad
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center">
            Daily Budget ($) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            min="5"
            value={campaignData.budget || ""}
            onChange={handleInputChange}
            className={errors.budget ? "border-red-500" : ""}
          />
          <FormError error={errors.budget} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective" className="flex items-center">
            Campaign Objective <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={campaignData.objective || ""} 
            onValueChange={(value) => handleSelectChange("objective", value)}
          >
            <SelectTrigger className={errors.objective ? "border-red-500" : ""}>
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
          <FormError error={errors.objective} />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
