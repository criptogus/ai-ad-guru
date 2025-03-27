
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "./FormError";

interface AudienceTabProps {
  campaignData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string | null>;
}

const AudienceTab: React.FC<AudienceTabProps> = ({
  campaignData,
  handleInputChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="flex items-center">
          Target Audience <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="targetAudience"
          name="targetAudience"
          rows={4}
          value={campaignData.targetAudience || ""}
          onChange={handleInputChange}
          placeholder="Describe your ideal audience (e.g., 'Business owners aged 30-45 interested in marketing automation')"
          className={errors.targetAudience ? "border-red-500" : ""}
        />
        <FormError error={errors.targetAudience} />
        <p className="text-xs text-muted-foreground">
          The more specific your audience description, the better your ad targeting will be
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">
          Keywords (Optional)
        </Label>
        <Textarea
          id="keywords"
          name="keywords"
          rows={2}
          value={campaignData.keywords || ""}
          onChange={handleInputChange}
          placeholder="Enter comma-separated keywords related to your campaign"
        />
        <p className="text-xs text-muted-foreground">
          These keywords will help improve ad matching and targeting accuracy
        </p>
      </div>
    </div>
  );
};

export default AudienceTab;
