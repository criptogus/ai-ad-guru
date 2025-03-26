
import React from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface AdTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  thumbnailUrl?: string;
  dimensions: {
    width: number;
    height: number;
  };
  platform: "instagram" | "linkedin";
}

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AdTemplate) => void;
  platform: "instagram" | "linkedin";
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  platform
}) => {
  // Filter templates by platform
  const templates = adTemplates.filter(template => template.platform === platform);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-0" onClick={onClose}>
      <Card 
        className="w-full max-w-md md:max-w-lg max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Ad Templates</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <CardContent className="p-4">
          <ScrollArea className="h-[calc(90vh-120px)] md:h-[500px]">
            <div className="grid grid-cols-2 gap-4 pb-2">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="cursor-pointer group"
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                >
                  <div className="w-full aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:-translate-y-0.5 transition shadow-sm flex flex-col items-center justify-center group-hover:ring-2 group-hover:ring-blue-400">
                    {template.thumbnailUrl ? (
                      <img 
                        src={template.thumbnailUrl} 
                        alt={template.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 px-2 text-center">{template.category}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                    {template.name}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// Template data
const adTemplates: AdTemplate[] = [
  {
    id: "services-1",
    name: "Professional Services",
    category: "Services",
    prompt: "A sleek, minimalist office interior with a glowing holographic dashboard floating above a glass desk, soft neon blue accents (#3B82F6), modern furniture in #F9FAFB tones, cinematic lighting with subtle lens flares, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "product-1",
    name: "Premium Product",
    category: "E-commerce",
    prompt: "A premium product (e.g., sleek headphones) isolated on a gradient background (#3B82F6 to #60A5FA), dramatic spotlight effect, subtle reflections on a glass surface, clean #FFFFFF accents, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "sales-1",
    name: "Flash Sale",
    category: "Sales",
    prompt: "A vibrant urban storefront at dusk with neon 'Sale' signs in #F59E0B (amber-500), bustling crowd silhouette in #111827 tones, dynamic energy with glowing #3B82F6 overlays, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "health-1",
    name: "Wellness & Health",
    category: "Health",
    prompt: "A serene wellness scene with a yoga pose in a sunlit studio, soft #10B981 (green-500) accents in plants and attire, calming #F9FAFB background, subtle glow effects, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "fintech-1",
    name: "Fintech Dashboard",
    category: "Fintech",
    prompt: "A futuristic financial dashboard with glowing #3B82F6 data streams and charts, sleek #111827 city skyline in the background, modern tech device (e.g., tablet) in focus, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "edtech-1",
    name: "Modern Learning",
    category: "Edtech",
    prompt: "A vibrant classroom scene with diverse students using sleek laptops, glowing #3B82F6 digital overlays of educational icons (books, graphs), bright #F9FAFB setting, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "travel-1",
    name: "Wanderlust",
    category: "Travel",
    prompt: "A stunning tropical beach at sunset with #F59E0B skies, turquoise water, and a sleek travel bag in #3B82F6 tones, soft horizon glow, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "fashion-1",
    name: "Fashion Forward",
    category: "Fashion",
    prompt: "A stylish model in a bold pose wearing vibrant #3B82F6 and #EF4444 outfits, minimalist #F9FAFB studio background, dramatic lighting with soft shadows, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "food-1",
    name: "Gourmet Delight",
    category: "Food & Beverage",
    prompt: "A close-up of a gourmet dish (e.g., sushi) with #10B981 garnish, rustic #F9FAFB wooden table, soft #3B82F6 steam effects, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  {
    id: "realestate-1",
    name: "Luxury Living",
    category: "Real Estate",
    prompt: "A luxurious modern home interior with #3B82F6 decor accents, expansive windows showing a #F9FAFB skyline, sleek furniture, high-resolution",
    dimensions: { width: 1080, height: 1080 },
    platform: "instagram"
  },
  // LinkedIn Templates
  {
    id: "linkedin-services-1",
    name: "Professional Services",
    category: "Services",
    prompt: "A sleek, minimalist office interior with a glowing holographic dashboard floating above a glass desk, soft neon blue accents (#3B82F6), modern furniture in #F9FAFB tones, cinematic lighting with subtle lens flares, high-resolution (1200x627px)",
    dimensions: { width: 1200, height: 627 },
    platform: "linkedin"
  },
  {
    id: "linkedin-product-1",
    name: "B2B Solution",
    category: "E-commerce",
    prompt: "A premium product (e.g., sleek headphones) isolated on a gradient background (#3B82F6 to #60A5FA), dramatic spotlight effect, subtle reflections on a glass surface, clean #FFFFFF accents, high-resolution (1200x627px)",
    dimensions: { width: 1200, height: 627 },
    platform: "linkedin"
  },
  {
    id: "linkedin-fintech-1",
    name: "Financial Solutions",
    category: "Fintech",
    prompt: "A futuristic financial dashboard with glowing #3B82F6 data streams and charts, sleek #111827 city skyline in the background, modern tech device (e.g., tablet) in focus, high-resolution (1200x627px)",
    dimensions: { width: 1200, height: 627 },
    platform: "linkedin"
  },
  {
    id: "linkedin-business-1",
    name: "Business Growth",
    category: "Business",
    prompt: "A professional team meeting in a modern office with #3B82F6 accents, sleek glass walls showing a city view, diverse business professionals collaborating over charts, high-resolution (1200x627px)",
    dimensions: { width: 1200, height: 627 },
    platform: "linkedin"
  },
  {
    id: "linkedin-recruiting-1",
    name: "Talent Recruitment",
    category: "Recruitment",
    prompt: "A welcoming, modern office space with diverse professionals collaborating, bright #F9FAFB workspace with #3B82F6 accents, subtle company branding, professional atmosphere, high-resolution (1200x627px)",
    dimensions: { width: 1200, height: 627 },
    platform: "linkedin"
  },
];

export default TemplateGallery;
export { adTemplates };
