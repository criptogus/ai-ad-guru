import { useState, useEffect } from "react";
import { BannerTemplate } from "./types";

export const useBannerTemplate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplate | null>(null);
  const [templates, setTemplates] = useState<BannerTemplate[]>([]);
  
  // Load predefined templates
  useEffect(() => {
    // These would typically come from an API or database
    const predefinedTemplates: BannerTemplate[] = [
      {
        id: "product-showcase",
        name: "Product Showcase",
        description: "Highlight your product features with high-contrast visuals",
        type: "product",
        previewImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "summer-promo",
        name: "Summer Sale",
        description: "Bright, vibrant template for seasonal promotions",
        type: "seasonal",
        previewImageUrl: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "webinar-event",
        name: "Webinar Announcement",
        description: "Professional layout for promoting online events",
        type: "event",
        previewImageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "brand-story",
        name: "Brand Story",
        description: "Elegant design to communicate your brand values",
        type: "brand",
        previewImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "flash-sale",
        name: "Flash Sale",
        description: "Eye-catching template for limited-time offers",
        type: "discount",
        previewImageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "minimalist",
        name: "Minimalist Design",
        description: "Clean, simple aesthetics for modern brands",
        type: "product",
        previewImageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "service-highlight",
        name: "Service Highlight",
        description: "Showcase your professional services",
        type: "brand",
        previewImageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60"
      },
      {
        id: "holiday-special",
        name: "Holiday Special",
        description: "Festive template for holiday promotions",
        type: "seasonal",
        previewImageUrl: "https://images.unsplash.com/photo-1482517967332-3a769055237c?w=600&auto=format&fit=crop&q=60"
      }
    ];
    
    setTemplates(predefinedTemplates);
  }, []);
  
  return {
    selectedTemplate,
    setSelectedTemplate,
    templates
  };
};
