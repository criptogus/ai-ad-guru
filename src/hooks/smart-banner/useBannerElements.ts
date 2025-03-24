
import { useState, useCallback, useEffect } from "react";
import { BannerElement, TextElement } from "./types";
import { BannerTemplate } from "@/components/smart-banner/types";

export const useBannerElements = (textElements: TextElement[]) => {
  const [bannerElements, setBannerElements] = useState<BannerElement[]>([]);

  // Initialize default banner elements based on text elements
  const initializeDefaultElements = useCallback((
    defaultTextElements: TextElement[],
    selectedTemplate: BannerTemplate
  ) => {
    const defaultBannerElements: BannerElement[] = [
      {
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
  }, []);

  // Sync banner elements with text elements when text changes
  useEffect(() => {
    if (textElements.length > 0 && bannerElements.length > 0) {
      const headlineTextEl = textElements.find(t => t.type === "headline");
      const subheadlineTextEl = textElements.find(t => t.type === "subheadline");
      const ctaTextEl = textElements.find(t => t.type === "cta");
      
      setBannerElements(prev => 
        prev.map((el, index) => {
          if (el.type === "text") {
            if (index === 0 && headlineTextEl) {
              return { ...el, content: headlineTextEl.content };
            } else if (index === 1 && subheadlineTextEl) {
              return { ...el, content: subheadlineTextEl.content };
            } else if (index === 2 && ctaTextEl) {
              return { ...el, content: ctaTextEl.content };
            }
          }
          return el;
        })
      );
    }
  }, [textElements, bannerElements.length]);

  return {
    bannerElements,
    setBannerElements,
    initializeDefaultElements
  };
};
