
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MetaAd } from "@/hooks/adGeneration";

interface ImagePromptFieldProps {
  testAd: MetaAd;
  onAdChange: (field: keyof MetaAd, value: string) => void;
}

const ImagePromptField: React.FC<ImagePromptFieldProps> = ({
  testAd,
  onAdChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="imagePrompt">Image Prompt</Label>
      <Textarea
        id="imagePrompt"
        value={testAd.imagePrompt || ""}
        onChange={(e) => onAdChange("imagePrompt", e.target.value)}
        placeholder="Describe the image you want to generate"
        rows={3}
      />
    </div>
  );
};

export default ImagePromptField;
