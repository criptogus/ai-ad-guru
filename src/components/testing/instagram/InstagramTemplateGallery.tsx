import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TriggerButtonInline } from "@/components/campaign/ad-preview/TriggerButtonInline";
import { Tag, MessageSquare, Edit, Sparkles } from "lucide-react";
import { TemplateCard } from "./TemplateCard";

export interface InstagramTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  hasVariables?: boolean;
}

interface InstagramTemplateGalleryProps {
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const InstagramTemplateGallery: React.FC<InstagramTemplateGalleryProps> = ({ onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Template categories and data
  const templates: InstagramTemplate[] = [
    // Urgency & Scarcity
    {
      id: "flash-countdown",
      title: "Flash Countdown",
      category: "urgency",
      prompt: "A digital countdown timer showing ${mainText:3 HOURS LEFT} on a vibrant background with urgency colors. Show excitement about limited time offer."
    },
    {
      id: "low-stock",
      title: "Low Stock Alert",
      category: "urgency",
      prompt: "A product display with ${mainText:ONLY 3 LEFT} label prominently shown. Create a sense of urgency with visual indicators of scarcity."
    },
    {
      id: "weekend-sale",
      title: "Weekend Sale",
      category: "urgency",
      prompt: "A promotional image featuring ${mainText:20% OFF} with a countdown to Sunday. Weekend vibes with shopping elements."
    },
    {
      id: "early-bird",
      title: "Early Bird Offer",
      category: "urgency",
      prompt: "An early morning scene with ${mainText:RESERVE NOW & SAVE} text. Visual elements suggesting being first or ahead of others."
    },
    
    // Personal Branding
    {
      id: "free-guide",
      title: "Free Guide Download",
      category: "personal-branding",
      prompt: "Professional-looking downloadable guide cover with ${mainText:FREE GROWTH PLAN} title. Include download icon or button visualization."
    },
    {
      id: "webinar-promo",
      title: "Webinar Promotion",
      category: "personal-branding",
      prompt: "Virtual event promotional graphic for ${mainText:LIVE THIS THURSDAY} webinar. Include elements suggesting live streaming or online presentation."
    },
    {
      id: "testimonial",
      title: "Client Testimonial",
      category: "personal-branding",
      prompt: "A professional testimonial design with quote marks and ${mainText:THIS CHANGED HOW I WORK} testimonial. Clean, trustworthy aesthetic."
    },
    
    // E-commerce
    {
      id: "product-carousel",
      title: "Product Carousel",
      category: "e-commerce",
      prompt: "A stylish product display with ${mainText:SWIPE TO SHOP} indicator and multiple product items arranged in a horizontal layout."
    },
    {
      id: "price-drop",
      title: "Price Drop Alert",
      category: "e-commerce", 
      prompt: "Price comparison graphic showing ${mainText:NOW $49 (was $79)} with visual elements suggesting savings or discount."
    },
    {
      id: "vip-deal",
      title: "VIP Member Deal",
      category: "e-commerce",
      prompt: "Exclusive VIP offer graphic with ${mainText:MEMBERS SAVE 30%} messaging. Luxury or premium visual elements."
    },
    
    // Education
    {
      id: "course-launch",
      title: "Course Launch",
      category: "education",
      prompt: "Educational course promotional image with ${mainText:LEARN AI IN 30 DAYS} title. Include learning or progress visual elements."
    },
    {
      id: "free-trial",
      title: "Free Trial Offer",
      category: "education",
      prompt: "Free trial promotional graphic with ${mainText:TRY FREE. NO CREDIT CARD.} message. Clear, trustworthy design for educational platform."
    },
    
    // Social Engagement
    {
      id: "tag-friend",
      title: "Tag a Friend",
      category: "social",
      prompt: "Engaging social media post with ${mainText:WHO NEEDS TO SEE THIS} message and tagging indicators. Fun, shareable aesthetic."
    },
    {
      id: "challenge",
      title: "7-Day Challenge",
      category: "social",
      prompt: "Challenge promotional graphic with ${mainText:JOIN THE 7-DAY RESET} title. Include calendar or progress tracking visual elements."
    }
  ];
  
  // Group templates by category
  const categories = [
    { id: "urgency", name: "Urgency & Scarcity", emoji: "🔥" },
    { id: "personal-branding", name: "Personal Branding", emoji: "👤" },
    { id: "e-commerce", name: "E-commerce / Retail", emoji: "🛍️" },
    { id: "education", name: "Education / EdTech", emoji: "📚" },
    { id: "social", name: "Social & Engagement", emoji: "💬" }
  ];
  
  // Filter templates based on active category
  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === activeCategory);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Instagram Ad Templates</h3>
        <TriggerButtonInline 
          onInsert={() => {}} 
          className="opacity-0 pointer-events-none" 
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeCategory === "all" ? "secondary" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setActiveCategory("all")}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          All Templates
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "secondary" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="mr-1.5">{category.emoji}</span>
            {category.name}
          </Button>
        ))}
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard 
              key={template.id}
              template={template}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default InstagramTemplateGallery;
