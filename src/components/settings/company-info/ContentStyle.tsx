
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyInfo } from "@/types/supabase";

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Dutch",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Other"
];

const TONE_OPTIONS = [
  "Professional",
  "Conversational",
  "Fun",
  "Bold",
  "Custom"
];

const TONE_EXAMPLES = {
  Professional: "Trusted by enterprises worldwide.",
  Conversational: "Let's grow your business together!",
  Fun: "Marketing made easy and awesome!",
  Bold: "Dominate your market with AI.",
  Custom: "Create your own tone of voice."
};

interface ContentStyleProps {
  companyInfo: CompanyInfo;
  onUpdate: (field: keyof CompanyInfo, value: string) => void;
}

const ContentStyle: React.FC<ContentStyleProps> = ({
  companyInfo,
  onUpdate
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Content Style</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select 
            value={companyInfo.language || "English"} 
            onValueChange={(value) => onUpdate("language", value)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tone">Tone of Voice</Label>
          <Select 
            value={companyInfo.tone_of_voice || "Professional"} 
            onValueChange={(value) => onUpdate("tone_of_voice", value)}
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {companyInfo.tone_of_voice && companyInfo.tone_of_voice !== "Custom" && (
            <p className="text-xs text-muted-foreground mt-1">
              Example: "{TONE_EXAMPLES[companyInfo.tone_of_voice as keyof typeof TONE_EXAMPLES]}"
            </p>
          )}
        </div>
      </div>
      
      {companyInfo.tone_of_voice === "Custom" && (
        <div className="space-y-2">
          <Label htmlFor="custom-tone">Custom Tone Description</Label>
          <Textarea
            id="custom-tone"
            value={companyInfo.custom_tone || ""}
            onChange={(e) => onUpdate("custom_tone", e.target.value)}
            placeholder="Describe your brand's unique tone of voice..."
            className="min-h-[100px]"
          />
        </div>
      )}
    </div>
  );
};

export default ContentStyle;
