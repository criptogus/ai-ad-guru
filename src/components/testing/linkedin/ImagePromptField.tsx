
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";

interface ImagePromptFieldProps {
  prompt: string;
  onChange: (value: string) => void;
}

const ImagePromptField: React.FC<ImagePromptFieldProps> = ({ prompt, onChange }) => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="imagePrompt">Image Prompt</Label>
      <Controller
        name="imagePrompt"
        control={control}
        defaultValue={prompt}
        render={({ field }) => (
          <Textarea
            id="imagePrompt"
            className="min-h-[100px]"
            placeholder="Describe the image you want to generate..."
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
              onChange(e.target.value);
            }}
          />
        )}
      />
      <p className="text-xs text-muted-foreground">
        Describe the image you want, including details about style, mood, and content. The AI will generate an image based on your description.
      </p>
    </div>
  );
};

export default ImagePromptField;
