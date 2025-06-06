
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BannerTemplate, BannerFormat, BannerPlatform, TextElement, BannerElement } from "./types";
import { getDefaultHeadline, getDefaultSubheadline, getDefaultCTA } from "./utils/defaultTextHelper";
import { useUserImageBank } from "./useUserImageBank";
import { useUserAIImageGeneration } from "./useUserAIImageGeneration";
import { useTextElements } from "./useTextElements";
import { useBannerElements } from "./useBannerElements";
import { toast } from "sonner";

export type { TextElement, BannerElement };

export const useBannerEditor = (
  selectedTemplate: BannerTemplate | null,
  selectedFormat: BannerFormat,
  selectedPlatform: BannerPlatform
) => {
  const { user } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [brandTone, setBrandTone] = useState<string>("professional");
  
  const { 
    textElements, 
    setTextElements, 
    updateTextElement, 
    generateAIText, 
    isGeneratingText 
  } = useTextElements();
  
  const {
    bannerElements,
    setBannerElements,
    initializeDefaultElements
  } = useBannerElements(textElements);
  
  const {
    userImages,
    isUploading,
    uploadImage,
    saveImageToUserBank
  } = useUserImageBank(user?.id);
  
  const {
    isGenerating: isGeneratingImage,
    generateImage,
    lastGeneratedImageUrl,
  } = useUserAIImageGeneration();

  // Initialize default text elements when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const defaultTextElements: TextElement[] = [
        {
          id: crypto.randomUUID(),
          type: "headline",
          content: getDefaultHeadline(selectedTemplate.type)
        },
        {
          id: crypto.randomUUID(),
          type: "subheadline",
          content: getDefaultSubheadline(selectedTemplate.type)
        },
        {
          id: crypto.randomUUID(),
          type: "cta",
          content: getDefaultCTA(selectedTemplate.type)
        }
      ];
      
      setTextElements(defaultTextElements);
      initializeDefaultElements(defaultTextElements, selectedTemplate);
    }
  }, [selectedTemplate, setTextElements, initializeDefaultElements]);

  // Handle AI image generation 
  const handleGenerateAIImage = async (prompt: string): Promise<void> => {
    const imageUrl = await generateImage({
      promptTemplate: prompt,
      brandTone: brandTone
    });
    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  };

  // Regenerate image with the same settings
  const regenerateImage = async (): Promise<void> => {
    if (lastGeneratedImageUrl) {
      const newUrl = await generateImage({
        promptTemplate: "Regenerate the previous image with a different variation",
        brandTone: brandTone
      });
      if (newUrl) {
        setBackgroundImage(newUrl);
      }
    }
  };

  // Handle image upload
  const handleUploadImage = async (file: File): Promise<void> => {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  };

  // Select image from user's image bank
  const selectUserImage = (imageUrl: string): void => {
    setBackgroundImage(imageUrl);
    toast.success("Image selected from your bank");
  };

  // Handle text element updates and sync with banner elements
  const handleUpdateTextElement = (id: string, updates: Partial<TextElement>) => {
    updateTextElement(id, updates);
    
    if (updates.content !== undefined) {
      setBannerElements(prev => 
        prev.map(el => {
          if (el.type === "text") {
            const textEl = textElements.find(t => t.id === id);
            if (textEl) {
              return { ...el, content: updates.content };
            }
          }
          return el;
        })
      );
    }
  };

  return {
    backgroundImage,
    setBackgroundImage,
    textElements,
    updateTextElement: handleUpdateTextElement,
    generateAIImage: handleGenerateAIImage,
    isGeneratingImage,
    regenerateImage,
    generateAIText,
    isGeneratingText,
    uploadImage: handleUploadImage,
    isUploading,
    bannerElements,
    setBannerElements,
    brandTone,
    setBrandTone,
    userImages,
    selectUserImage,
    saveImageToUserBank
  };
};
