
import { useState, useEffect } from "react";
import { BannerTemplate, BannerFormat, BannerPlatform } from "@/components/smart-banner/SmartBannerBuilder";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { getCreditCosts, consumeCredits } from "@/services";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface TextElement {
  id: string;
  type: "headline" | "subheadline" | "cta";
  content: string;
}

export interface BannerElement {
  id: string;
  type: "text" | "logo" | "shape";
  content: string;
  x: number;
  y: number;
  zIndex?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  scale?: number;
  width?: string;
  rotation?: number;
}

export const useBannerEditor = (
  selectedTemplate: BannerTemplate | null,
  selectedFormat: BannerFormat,
  selectedPlatform: BannerPlatform
) => {
  const { user } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerElements, setBannerElements] = useState<BannerElement[]>([]);
  const [brandTone, setBrandTone] = useState("professional");
  
  const creditCosts = getCreditCosts();

  // Initialize default text elements
  useEffect(() => {
    if (selectedTemplate) {
      const defaultTextElements: TextElement[] = [
        {
          id: uuidv4(),
          type: "headline",
          content: getDefaultHeadline(selectedTemplate.type)
        },
        {
          id: uuidv4(),
          type: "subheadline",
          content: getDefaultSubheadline(selectedTemplate.type)
        },
        {
          id: uuidv4(),
          type: "cta",
          content: getDefaultCTA(selectedTemplate.type)
        }
      ];
      
      setTextElements(defaultTextElements);
      
      // Initialize banner elements for positioning
      const defaultBannerElements: BannerElement[] = [
        {
          id: uuidv4(),
          type: "text",
          content: defaultTextElements[0].content, // Headline
          x: 50,
          y: 30,
          zIndex: 2,
          color: "#ffffff",
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center",
          width: "80%"
        },
        {
          id: uuidv4(),
          type: "text",
          content: defaultTextElements[1].content, // Subheadline
          x: 50,
          y: 50,
          zIndex: 2,
          color: "#ffffff",
          fontSize: 20,
          fontWeight: "normal",
          textAlign: "center",
          width: "70%"
        },
        {
          id: uuidv4(),
          type: "text",
          content: defaultTextElements[2].content, // CTA
          x: 50,
          y: 75,
          zIndex: 2,
          color: "#ffffff",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
          width: "auto"
        }
      ];
      
      setBannerElements(defaultBannerElements);
    }
  }, [selectedTemplate]);

  // Generate default text based on template type
  const getDefaultHeadline = (templateType: string): string => {
    switch (templateType) {
      case "product":
        return "Discover Our Premium Product";
      case "seasonal":
        return "Summer Special Offer";
      case "event":
        return "Join Our Exclusive Event";
      case "brand":
        return "Trust the Industry Leader";
      case "discount":
        return "30% Off Limited Time";
      default:
        return "Your Compelling Headline";
    }
  };

  const getDefaultSubheadline = (templateType: string): string => {
    switch (templateType) {
      case "product":
        return "Quality and performance you can rely on";
      case "seasonal":
        return "Celebrate the season with our exclusive deals";
      case "event":
        return "Network with industry experts and pioneers";
      case "brand":
        return "Trusted by thousands of satisfied customers";
      case "discount":
        return "Use code SAVE30 at checkout today";
      default:
        return "Supporting information to convince your audience";
    }
  };

  const getDefaultCTA = (templateType: string): string => {
    switch (templateType) {
      case "product":
        return "Shop Now";
      case "seasonal":
        return "Get the Offer";
      case "event":
        return "Register Today";
      case "brand":
        return "Learn More";
      case "discount":
        return "Claim Discount";
      default:
        return "Click Here";
    }
  };

  // Update a text element
  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    // Update the text elements array
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
    
    // Also update the corresponding banner element
    setBannerElements(prev => 
      prev.map(el => {
        if (el.type === "text") {
          const textEl = textElements.find(t => t.id === id);
          if (textEl && updates.content !== undefined) {
            return { ...el, content: updates.content };
          }
        }
        return el;
      })
    );
  };

  // Generate an AI image for the banner background
  const generateAIImage = async (prompt: string): Promise<void> => {
    if (!user) {
      toast.error("Please log in to generate images");
      return;
    }
    
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      // Preview credit usage
      toast.info("Credit Usage Preview", {
        description: `This will use ${creditCosts.smartBanner} credits to generate this banner image`,
        duration: 3000,
      });
      
      // Consume credits
      const creditSuccess = await consumeCredits(
        user.id,
        creditCosts.smartBanner,
        'smart_banner_creation',
        `AI Banner for ${selectedPlatform} (${selectedFormat})`
      );
      
      if (!creditSuccess) {
        toast.error("Insufficient Credits", {
          description: "You don't have enough credits to generate this image",
          duration: 5000,
        });
        return;
      }
      
      // Determine image dimensions based on format
      let imageFormat = "square";
      if (selectedFormat === "horizontal") {
        imageFormat = "landscape";
      } else if (selectedFormat === "story") {
        imageFormat = "portrait";
      }
      
      // Call the Supabase function to generate the image with DALL-E
      const { data, error } = await supabase.functions.invoke('generate-banner-image', {
        body: { 
          prompt,
          platform: selectedPlatform,
          imageFormat,
          templateType: selectedTemplate.type,
          templateName: selectedTemplate.name,
          brandTone
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.imageUrl) {
        throw new Error("No image was generated");
      }
      
      // Set the background image
      setBackgroundImage(data.imageUrl);
      
      toast.success("Banner image generated successfully");
    } catch (error) {
      console.error("Error generating AI image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      // Refund credits on failure
      if (user) {
        await consumeCredits(
          user.id,
          -creditCosts.smartBanner,
          'credit_refund',
          'Refund for failed banner image generation'
        );
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Regenerate the AI image with the same prompt
  const regenerateImage = async (): Promise<void> => {
    // This would typically use the same prompt as before
    // For simplicity, we're mocking this functionality
    setIsGeneratingImage(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real implementation, you would call the AI service again
      toast.success("Banner image regenerated");
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.error("Failed to regenerate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Generate AI text for headlines, subheadlines, or CTAs
  const generateAIText = async (elementId: string, type: "headline" | "subheadline" | "cta"): Promise<void> => {
    setIsGeneratingText(true);
    
    try {
      // In a real implementation, you would call an AI service
      // For now, we'll use placeholder text
      
      let generatedText = "";
      
      switch (type) {
        case "headline":
          generatedText = "Introducing Our Revolutionary Product";
          break;
        case "subheadline":
          generatedText = "Experience the difference our solution makes for your business";
          break;
        case "cta":
          generatedText = "Get Started Today";
          break;
      }
      
      // Update the text element
      updateTextElement(elementId, { content: generatedText });
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated`);
    } catch (error) {
      console.error("Error generating AI text:", error);
      toast.error("Failed to generate text");
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Upload a custom image
  const uploadImage = async (file: File): Promise<void> => {
    setIsUploading(true);
    
    try {
      const fileReader = new FileReader();
      
      const result = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });
      
      setBackgroundImage(result);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    backgroundImage,
    setBackgroundImage,
    textElements,
    updateTextElement,
    generateAIImage,
    isGeneratingImage,
    regenerateImage,
    generateAIText,
    isGeneratingText,
    uploadImage,
    isUploading,
    bannerElements,
    setBannerElements,
    brandTone,
    setBrandTone
  };
};
