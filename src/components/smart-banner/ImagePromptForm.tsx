import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Image as ImageIcon, RefreshCw } from "lucide-react";
import { BannerTemplate, BannerFormat, BannerPlatform } from "./types";

interface ImagePromptFormProps {
  template: BannerTemplate;
  platform: BannerPlatform;
  format: BannerFormat;
  onSubmit: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

const ImagePromptForm: React.FC<ImagePromptFormProps> = ({
  template,
  platform,
  format,
  onSubmit,
  isGenerating
}) => {
  const [prompt, setPrompt] = useState("");
  const [brandTone, setBrandTone] = useState("professional");

  useEffect(() => {
    let defaultPrompt = "";
    
    if (template.id === "webinar-event") {
      defaultPrompt = "A professional webinar announcement with virtual conference imagery, featuring a laptop or screen with audience participants, modern technology elements, and a professional speaker or host. Include visual cues that suggest learning, interaction, and online engagement.";
    } else if (template.id === "holiday-special") {
      defaultPrompt = "A festive holiday-themed promotional image with seasonal decorations, warm lighting, gift elements, and celebratory atmosphere appropriate for end-of-year promotions or holiday sales.";
    } else if (template.id === "flash-sale") {
      defaultPrompt = "A high-energy flash sale promotional image with bold colors, dynamic elements that create urgency, price reduction visuals, limited-time offer indicators, and excitement-generating design elements.";
    } else {
      switch (template.type) {
        case "product":
          defaultPrompt = "A professional product image with clean background, showing the product from an optimal angle with commercial-grade lighting.";
          break;
        case "seasonal":
          defaultPrompt = `A ${getSeason()} themed promotional image that evokes the feeling of the season with appropriate colors and elements.`;
          break;
        case "event":
          defaultPrompt = "A professional event announcement image with dynamic composition that creates excitement and anticipation.";
          break;
        case "brand":
          defaultPrompt = "A sophisticated brand awareness image with clean visuals that communicate trust, quality and professionalism.";
          break;
        case "discount":
          defaultPrompt = "An eye-catching sales promotion image with high contrast elements that create a sense of urgency and value.";
          break;
        default:
          defaultPrompt = "A professional advertising image for a marketing campaign with balanced composition and commercial appeal.";
      }
    }
    
    if (platform === "instagram") {
      defaultPrompt += " Optimized for Instagram with vibrant details and social-friendly composition.";
    } else if (platform === "linkedin") {
      defaultPrompt += " Tailored for LinkedIn with professional aesthetics and business-appropriate imagery.";
    } else if (platform === "google") {
      defaultPrompt += " Designed for Google display ads with clear focal points and balanced visual hierarchy.";
    }
    
    if (format === "square") {
      defaultPrompt += " Composed for square format with balanced central elements.";
    } else if (format === "horizontal") {
      defaultPrompt += " Designed for horizontal/landscape format with extended visual elements.";
    } else if (format === "story") {
      defaultPrompt += " Created for vertical/story format with stacked visual hierarchy.";
    }
    
    if (template.name.toLowerCase().includes("minimalist")) {
      defaultPrompt += " Using a minimalist design approach with clean lines and ample white space.";
    } else if (template.name.toLowerCase().includes("flash")) {
      defaultPrompt += " Creating a sense of urgency with dynamic visual elements.";
    }
    
    setPrompt(defaultPrompt);
  }, [template, platform, format]);

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="image-prompt" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Image Generation
          </Label>
          <div className="text-xs text-muted-foreground">
            8 credits
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="brand-tone" className="text-sm mb-1 block">Brand Tone</Label>
          <Select value={brandTone} onValueChange={setBrandTone}>
            <SelectTrigger id="brand-tone" className="w-full">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="playful">Playful & Fun</SelectItem>
              <SelectItem value="luxury">Luxury & Premium</SelectItem>
              <SelectItem value="creative">Creative & Artistic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Textarea
          id="image-prompt"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="resize-none"
        />
        
        <div className="text-xs text-muted-foreground">
          <p>Prompt should describe the visual elements, style, and mood you want in your banner.</p>
          <p className="mt-1">For best results, be specific about products, colors, and composition.</p>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full gap-2"
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate AI Image
          </>
        )}
      </Button>
    </form>
  );
};

export default ImagePromptForm;
