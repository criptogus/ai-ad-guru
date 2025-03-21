import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { BannerTemplate, BannerFormat, BannerPlatform, TextElement, BannerElement } from "./types";
import { getDefaultHeadline, getDefaultSubheadline, getDefaultCTA } from "./utils/defaultTextHelper";
import { useUserImageBank } from "./useUserImageBank";
import { useAIImageGeneration } from "./useAIImageGeneration";
import { useTextElements } from "./useTextElements";
import { toast } from "sonner";

export type { TextElement, BannerElement };

export const useBannerEditor = (
  selectedTemplate: BannerTemplate | null,
  selectedFormat: BannerFormat,
  selectedPlatform: BannerPlatform
) => {
  const { user } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bannerElements, setBannerElements] = useState<BannerElement[]>([]);
  
  const { 
    textElements, 
    setTextElements, 
    updateTextElement, 
    generateAIText, 
    isGeneratingText 
  } = useTextElements();
  
  const {
    userImages,
    isUploading,
    uploadImage,
    saveImageToUserBank
  } = useUserImageBank(user?.id);
  
  const {
    isGeneratingImage,
    generateAIImage,
    regenerateImage,
    brandTone,
    setBrandTone
  } = useAIImageGeneration(
    selectedTemplate, 
    selectedFormat, 
    selectedPlatform, 
    user?.id,
    saveImageToUserBank
  );

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
      
      const defaultBannerElements: BannerElement[] = [
        {
          id: uuidv4(),
          type: "text",
          content: defaultTextElements[0].content,
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
          content: defaultTextElements[1].content,
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
          content: defaultTextElements[2].content,
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
  }, [selectedTemplate, setTextElements]);

  useEffect(() => {
    if (textElements.length > 0 && bannerElements.length > 0) {
      setBannerElements(prev => 
        prev.map(el => {
          if (el.type === "text") {
            const contentType = el.content.includes(getDefaultHeadline("product")) ? "headline" :
                               el.content.includes(getDefaultSubheadline("product")) ? "subheadline" :
                               el.content.includes(getDefaultCTA("product")) ? "cta" : null;
            
            if (contentType) {
              const matchingTextEl = textElements.find(t => t.type === contentType);
              if (matchingTextEl) {
                return { ...el, content: matchingTextEl.content };
              }
            }
          }
          return el;
        })
      );
    }
  }, [textElements, bannerElements.length]);

  const handleGenerateAIImage = async (prompt: string): Promise<void> => {
    const imageUrl = await generateAIImage(prompt);
    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  };

  const handleUploadImage = async (file: File): Promise<void> => {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  };

  const selectUserImage = (imageUrl: string): void => {
    setBackgroundImage(imageUrl);
    toast.success("Image selected from your bank");
  };

  const handleUpdateTextElement = (id: string, updates: Partial<TextElement>) => {
    updateTextElement(id, updates);
    
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
