
import { useState, useEffect } from "react";
import { BannerTemplate } from "@/components/smart-banner/SmartBannerBuilder";

export const useBannerTemplate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplate | null>(null);
  const [templates, setTemplates] = useState<BannerTemplate[]>([]);
  
  // Load predefined templates
  useEffect(() => {
    // These would typically come from an API or database
    const predefinedTemplates: BannerTemplate[] = [
      {
        id: "product-highlight",
        name: "Product Highlight",
        description: "Showcase your product features with a clean, focused design",
        type: "product",
        previewImageUrl: "https://placehold.co/600x400/e9ecef/495057?text=Product+Highlight"
      },
      {
        id: "seasonal-promo",
        name: "Seasonal Promotion",
        description: "Highlight seasonal offers or time-limited promotions",
        type: "seasonal",
        previewImageUrl: "https://placehold.co/600x400/e2f4ea/0d503c?text=Seasonal+Promo"
      },
      {
        id: "event-ad",
        name: "Event Ad",
        description: "Promote webinars, conferences or special events",
        type: "event",
        previewImageUrl: "https://placehold.co/600x400/fff3cd/856404?text=Event+Ad"
      },
      {
        id: "brand-awareness",
        name: "Brand Awareness",
        description: "Increase recognition and visibility for your brand",
        type: "brand",
        previewImageUrl: "https://placehold.co/600x400/d1ecf1/0c5460?text=Brand+Awareness"
      },
      {
        id: "discount-alert",
        name: "Discount Alert",
        description: "Highlight discounts, sales or special pricing",
        type: "discount",
        previewImageUrl: "https://placehold.co/600x400/f8d7da/721c24?text=Discount+Alert"
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
