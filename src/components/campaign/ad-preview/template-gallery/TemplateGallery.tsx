
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";

export interface AdTemplateCategory {
  id: string;
  name: string;
  templates: AdTemplate[];
}

export interface AdTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  prompt: string;
  dimensions: {
    width: number;
    height: number;
  };
  category: string;
}

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AdTemplate) => void;
  platform: "instagram" | "linkedin" | string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  platform
}) => {
  // Filtered templates based on platform
  const templates = getTemplatesForPlatform(platform);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ad Templates</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <button
              key={template.id}
              className="group flex flex-col items-center p-2 border rounded-lg hover:border-blue-500 hover:-translate-y-0.5 transition-all"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-2">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <span className="text-sm font-medium group-hover:text-blue-500">{template.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get templates for a specific platform
function getTemplatesForPlatform(platform: string): AdTemplate[] {
  // Return the templates based on the platform
  if (platform === "instagram") {
    return instagramTemplates;
  } else if (platform === "linkedin") {
    return linkedInTemplates;
  }
  
  return [];
}

// Instagram ad templates
const instagramTemplates: AdTemplate[] = [
  {
    id: "insta-services-1",
    name: "Services - Professional",
    description: "Sleek office with holographic dashboard, ideal for tech services",
    thumbnail: "https://source.unsplash.com/random/300x300?office,tech",
    prompt: "A sleek, minimalist office interior with a glowing holographic dashboard floating above a glass desk, soft neon blue accents (#3B82F6), modern furniture in #F9FAFB tones, cinematic lighting with subtle lens flares, high-resolution, agency-quality composition, photorealistic",
    dimensions: { width: 1080, height: 1080 },
    category: "services"
  },
  {
    id: "insta-product-1",
    name: "Product Showcase",
    description: "Premium product on gradient background with spotlight",
    thumbnail: "https://source.unsplash.com/random/300x300?product,headphones",
    prompt: "A premium product (e.g., sleek headphones) isolated on a gradient background (#3B82F6 to #60A5FA), dramatic spotlight effect, subtle reflections on a glass surface, clean #FFFFFF accents, high-resolution, modern and bold aesthetic, agency-crafted",
    dimensions: { width: 1080, height: 1080 },
    category: "products"
  },
  {
    id: "insta-sales-1",
    name: "Sales Promotion",
    description: "Vibrant storefront with neon sale signs",
    thumbnail: "https://source.unsplash.com/random/300x300?store,sale",
    prompt: "A vibrant urban storefront at dusk with neon 'Sale' signs in #F59E0B (amber-500), bustling crowd silhouette in #111827 tones, dynamic energy with glowing #3B82F6 overlays, high-resolution, cinematic and trendy, agency-quality",
    dimensions: { width: 1080, height: 1080 },
    category: "sales"
  },
  {
    id: "insta-health-1",
    name: "Health & Wellness",
    description: "Serene wellness scene in a sunlit studio",
    thumbnail: "https://source.unsplash.com/random/300x300?yoga,wellness",
    prompt: "A serene wellness scene with a yoga pose in a sunlit studio, soft #10B981 (green-500) accents in plants and attire, calming #F9FAFB background, subtle glow effects, high-resolution, clean and modern, agency-polished",
    dimensions: { width: 1080, height: 1080 },
    category: "health"
  },
  {
    id: "insta-fintech-1",
    name: "Fintech Growth",
    description: "Futuristic financial dashboard with data visualizations",
    thumbnail: "https://source.unsplash.com/random/300x300?finance,technology",
    prompt: "A futuristic financial dashboard with glowing #3B82F6 data streams and charts, sleek #111827 city skyline in the background, modern tech device (e.g., tablet) in focus, high-resolution, professional and cutting-edge, agency-quality",
    dimensions: { width: 1080, height: 1080 },
    category: "fintech"
  }
];

// LinkedIn ad templates
const linkedInTemplates: AdTemplate[] = [
  {
    id: "linkedin-professional-1",
    name: "Professional Services",
    description: "Corporate setting with a modern office theme",
    thumbnail: "https://source.unsplash.com/random/1200x627?office,corporate",
    prompt: "A sleek corporate office with professionals in business attire, modern glass walls, subtle #3B82F6 branding elements, natural lighting, high-resolution (1200x627px), professional and polished, agency-quality, LinkedIn aesthetic",
    dimensions: { width: 1200, height: 627 },
    category: "services"
  },
  {
    id: "linkedin-education-1",
    name: "Professional Education",
    description: "Educational setting with modern technology",
    thumbnail: "https://source.unsplash.com/random/1200x627?education,technology",
    prompt: "A vibrant professional learning environment with diverse business people engaging with modern technology, subtle #3B82F6 UI elements, clean #F9FAFB background, high-resolution (1200x627px), professional and aspirational, LinkedIn-optimized",
    dimensions: { width: 1200, height: 627 },
    category: "education"
  },
  {
    id: "linkedin-recruitment-1",
    name: "Recruitment & Hiring",
    description: "Team collaboration in a modern workspace",
    thumbnail: "https://source.unsplash.com/random/1200x627?team,collaboration",
    prompt: "A diverse team collaborating in a modern workspace with glass whiteboards, subtle #3B82F6 business graphics, professional attire, bright and airy atmosphere, high-resolution (1200x627px), corporate and dynamic, LinkedIn-styled",
    dimensions: { width: 1200, height: 627 },
    category: "recruitment"
  },
  {
    id: "linkedin-technology-1",
    name: "Technology Solutions",
    description: "Futuristic tech with data visualizations",
    thumbnail: "https://source.unsplash.com/random/1200x627?technology,data",
    prompt: "A professional using advanced technology with holographic #3B82F6 data visualizations, modern office setting, subtle corporate elements, clean lighting, high-resolution (1200x627px), innovative and trustworthy, LinkedIn format",
    dimensions: { width: 1200, height: 627 },
    category: "technology"
  },
  {
    id: "linkedin-executive-1",
    name: "Executive Leadership",
    description: "Professional leadership setting with city view",
    thumbnail: "https://source.unsplash.com/random/1200x627?executive,leadership",
    prompt: "An executive leadership scene with professionals in a high-rise meeting room, city skyline view, subtle #3B82F6 branded elements, professional lighting, high-resolution (1200x627px), authoritative and premium, LinkedIn-optimized",
    dimensions: { width: 1200, height: 627 },
    category: "leadership"
  }
];

export default TemplateGallery;
