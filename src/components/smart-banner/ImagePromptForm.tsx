
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BannerFormat, BannerPlatform, BannerTemplate } from "./SmartBannerBuilder";
import { Loader2, Sparkles } from "lucide-react";

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
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");

  // Update the prompt when form inputs change
  useEffect(() => {
    let newPrompt = "";
    
    if (product && message) {
      // Base prompt construction
      newPrompt = `Create a ${format} format ad banner for ${platform} advertising`;
      
      // Add template type
      switch (template.type) {
        case "product":
          newPrompt += ` showing ${product} with a clean product-focused design`;
          break;
        case "seasonal":
          newPrompt += ` with a seasonal theme featuring ${product}`;
          break;
        case "event":
          newPrompt += ` for an event related to ${product}`;
          break;
        case "brand":
          newPrompt += ` for brand awareness of ${product}`;
          break;
        case "discount":
          newPrompt += ` promoting a discount or special offer on ${product}`;
          break;
      }
      
      // Add message context
      newPrompt += `. The main message is: "${message}".`;
      
      // Add tone
      newPrompt += ` Use a ${tone} visual tone.`;
      
      // Add format-specific guidance
      if (format === "square") {
        newPrompt += " Optimize for square format with balanced composition.";
      } else if (format === "horizontal") {
        newPrompt += " Create a horizontal banner with focal point slightly to the left.";
      } else if (format === "story") {
        newPrompt += " Design for vertical/story format with visual impact.";
      }
      
      // Add platform-specific optimization
      if (platform === "instagram") {
        newPrompt += " Optimize for Instagram with vibrant colors and lifestyle imagery.";
      } else if (platform === "linkedin") {
        newPrompt += " Optimize for LinkedIn with professional aesthetics.";
      } else if (platform === "google") {
        newPrompt += " Optimize for Google Display Network with clear branding and message.";
      }
      
      // Common best practices
      newPrompt += " Ensure the image has good contrast, clean layout, and doesn't include any text overlay (text will be added separately).";
    }
    
    setPrompt(newPrompt);
  }, [product, message, tone, template, platform, format]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt) {
      onSubmit(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4">
      <div className="space-y-1">
        <h3 className="font-medium flex items-center gap-2">
          <Sparkles size={16} className="text-purple-500" /> AI Image Generator
        </h3>
        <p className="text-sm text-muted-foreground">
          Generate an ad image with AI (8 credits)
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="product">Product or Service</Label>
          <Textarea
            id="product"
            placeholder="e.g., Eco-friendly water bottles, Online accounting software..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Promotional Message</Label>
          <Textarea
            id="message"
            placeholder="e.g., Summer Sale, New Product Launch, Limited Time Offer..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Visual Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preview-prompt">Generated Prompt</Label>
          <Textarea
            id="preview-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24 text-xs"
            readOnly
          />
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !prompt || !product || !message}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ImagePromptForm;
