
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ImagePromptFieldProps {
  prompt: string;
  onChange: (value: string) => void;
}

const ImagePromptField: React.FC<ImagePromptFieldProps> = ({ prompt, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="imagePrompt">Image Prompt</Label>
      <Textarea
        id="imagePrompt"
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the image you want to generate"
        rows={3}
      />
    </div>
  );
};

export default ImagePromptField;
