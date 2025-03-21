
import { useState } from "react";
import { toast } from "sonner";
import { TextElement } from "./types";

export const useTextElements = () => {
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);

  // Update a text element
  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
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

  return {
    textElements,
    setTextElements,
    updateTextElement,
    generateAIText,
    isGeneratingText
  };
};
