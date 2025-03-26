
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface TemplateCategory {
  title: string;
  templates: string[];
}

interface InstagramTemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
}

const InstagramTemplateGallery: React.FC<InstagramTemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const templateCategories: TemplateCategory[] = [
    {
      title: "🔥 Urgency & Scarcity",
      templates: [
        "Create an Instagram ad image and caption using a countdown-style urgency. Include bold text like 'Ends in 3h!' and highlight a time-sensitive offer for [INSERT PRODUCT or SERVICE]. Style: modern, clean, bold.",
        "Generate an Instagram ad showing a popular product with a 'Only 3 Left' urgency message. Include realistic product imagery and a minimalist text overlay to drive FOMO.",
        "Create a promo image for a weekend sale. Include text: '20% off until Sunday!' and a clean product display. Style: vibrant but trustworthy.",
        "Design an ad for early bird registration with a clear message like 'Reserve Now and Save'. Use optimistic tones and limited-time visuals.",
        "Create a happy hour-themed ad showing deals valid from 2–5pm. Use time-based icons and a high-contrast, fast-action design."
      ]
    },
    {
      title: "👤 Personal Branding",
      templates: [
        "Create an ad that promotes a downloadable guide from a creator. Use the phrase 'Download my growth plan' and a clean, personal photo with bold CTA button.",
        "Generate a webinar promotion ad with a headline 'Live This Thursday'. Include a host image and minimal but powerful overlay text.",
        "Create a testimonial-style ad with a quote: 'This changed how I work.' Use a profile photo and stylized quote graphic.",
        "Create an interactive-feel image that visually simulates a poll with two options, e.g., A or B. Style it like a carousel or question card.",
        "Generate an ad showing a 'before and after' visual transformation. Use split screen design and realistic lifestyle imagery."
      ]
    },
    {
      title: "🛍️ E-commerce / Retail",
      templates: [
        "Create a carousel preview image with 3–5 featured products and text 'Swipe to Shop the Collection'. Use real product mockups.",
        "Design an ad showing a product with price drop: 'Now $49 (was $79)'. Use contrast and badge design to emphasize savings.",
        "Generate an ad promoting an exclusive deal for members: 'Members Save 30%'. Use dark/light luxury theme.",
        "Create a 'Back by Popular Demand' announcement image. Highlight the product and add a minimal background.",
        "Showcase a top-selling product with badge or text overlay: '#1 Choice by 5,000+ Customers'."
      ]
    },
    {
      title: "📚 Education / EdTech",
      templates: [
        "Create an education ad announcing a new course with the headline 'Learn AI in 30 Days'. Show a classroom or tech-learning setting.",
        "Generate a signup ad promoting a free trial with 'Try Free. No Credit Card.' in bold, centered text.",
        "Design an ad promoting certification: 'Get Certified Fast'. Use certificate mockups or graduate-style visuals.",
        "Create a tutor-matching service ad with 'Top Tutors in 24 Hours'. Use mentor-student imagery.",
        "Make a student success story ad. Use text like 'How I landed my dream job' and a natural, trustworthy image."
      ]
    },
    {
      title: "💼 Hiring & Employer Branding",
      templates: [
        "Generate a hiring ad with text 'Join Our Remote Team'. Include visuals of people working from home.",
        "Create a collage or profile card-style ad that introduces the team with quote overlays.",
        "Ad promoting a referral program: 'Refer a Friend and Earn $100'. Use clear CTA and positive reward symbols.",
        "Design a modern job ad with perks like 'Remote. Flexible. Balanced.' Include lifestyle imagery.",
        "Show real office moments or team culture with caption 'We build cool things, together.'"
      ]
    },
    {
      title: "💳 Fintech / Finance",
      templates: [
        "Ad promoting a financial product: 'Get 10% Cashback This Month'. Use a card design and benefit overlay.",
        "Create a visual that tracks a savings goal with 'You're 85% There!'. Use progress bar design.",
        "Generate an ad showing score boost: 'Boost Your Score Fast'. Use clean credit dashboard mockups.",
        "Create a tip/advice post with caption 'Pay Yourself First'. Design as a quote card or infographic.",
        "Design a product launch visual: 'Now Available in 🇧🇷 Brazil'. Use branded tech UI imagery."
      ]
    },
    {
      title: "💬 Social & Engagement",
      templates: [
        "Design a social engagement post that invites users to tag friends. Use playful layout and large emoji.",
        "Create a clean inspiration quote card with 'Success = Consistency'. Use bold text on soft gradient background.",
        "Design a '7-Day Reset Challenge' ad. Use checklist or day-by-day layout.",
        "Create a comparison card: 'Dark Mode ☑️ Light Mode ⬜️'. Use visual toggles.",
        "Generate a mysterious teaser ad with the caption 'You won't believe this AI ad…'. Use visual intrigue."
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>🎯 Instagram Ad Template Gallery</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 mt-4">
          <div className="space-y-6">
            {templateCategories.map((category, categoryIndex) => (
              <div key={`category-${categoryIndex}`} className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">{category.title}</h3>
                <div className="space-y-3">
                  {category.templates.map((template, templateIndex) => (
                    <div 
                      key={`template-${categoryIndex}-${templateIndex}`} 
                      className="border p-3 rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm">{template}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSelectTemplate(template);
                            onClose();
                          }}
                          className="h-8 min-w-[100px] shrink-0"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramTemplateGallery;
