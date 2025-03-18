
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TargetAudienceEditor from "../website-analysis/TargetAudienceEditor";

// List of languages for the dropdown
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

// List of countries for the dropdown
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
];

interface TargetingTabProps {
  campaignData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleMultiSelectChange: (name: string, value: string) => void;
  isDeviceSelected: (device: string) => boolean;
}

const TargetingTab: React.FC<TargetingTabProps> = ({
  campaignData,
  handleInputChange,
  handleSelectChange,
  handleMultiSelectChange,
  isDeviceSelected,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <TargetAudienceEditor
          targetAudience={campaignData.targetAudience || ""}
          onChange={(value) => {
            const e = { target: { name: "targetAudience", value } } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(e);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select 
            value={campaignData.language || "en"} 
            onValueChange={(value) => handleSelectChange("language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select 
            value={campaignData.country || "US"} 
            onValueChange={(value) => handleSelectChange("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Devices</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          <Button
            type="button"
            variant={isDeviceSelected("desktop") ? "default" : "outline"}
            onClick={() => handleMultiSelectChange("device", "desktop")}
            className="text-xs"
          >
            Desktop
          </Button>
          <Button
            type="button"
            variant={isDeviceSelected("mobile") ? "default" : "outline"}
            onClick={() => handleMultiSelectChange("device", "mobile")}
            className="text-xs"
          >
            Mobile
          </Button>
          <Button
            type="button"
            variant={isDeviceSelected("tablet") ? "default" : "outline"}
            onClick={() => handleMultiSelectChange("device", "tablet")}
            className="text-xs"
          >
            Tablet
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ageRange">Age Range</Label>
          <Select 
            value={campaignData.ageRange || "18-65+"} 
            onValueChange={(value) => handleSelectChange("ageRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18-24">18-24</SelectItem>
              <SelectItem value="25-34">25-34</SelectItem>
              <SelectItem value="35-44">35-44</SelectItem>
              <SelectItem value="45-54">45-54</SelectItem>
              <SelectItem value="55-64">55-64</SelectItem>
              <SelectItem value="65+">65+</SelectItem>
              <SelectItem value="18-65+">All Ages (18+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select 
            value={campaignData.gender || "all"} 
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="locations">Specific Locations (Optional)</Label>
        <Textarea
          id="locations"
          name="locations"
          rows={2}
          placeholder="Enter specific cities, states or regions, separated by commas"
          value={campaignData.locations || ""}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to target the entire country
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Behaviors (Meta Ads)</Label>
        <Textarea
          id="interests"
          name="interests"
          rows={2}
          placeholder="Enter interests to target, separated by commas"
          value={campaignData.interests || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default TargetingTab;
