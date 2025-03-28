
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Edit2, CheckCircle2, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ImagePromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: string;
  industry?: string;
  thumbnail?: string;
}

// Enhanced templates with industry-specific premium templates
const imagePromptTemplates: ImagePromptTemplate[] = [
  // Original templates
  {
    id: "professional",
    title: "Professional",
    category: "business",
    prompt: "Professional business setting with modern office, clean and corporate style, high-quality professional photography",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    category: "lifestyle",
    prompt: "Lifestyle image showing happy person using product in natural setting, warm lighting, authentic candid style",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: "abstract",
    title: "Abstract",
    category: "abstract",
    prompt: "Abstract visual representation with brand colors, minimalist design, conceptual and artistic",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "product",
    title: "Product",
    category: "product",
    prompt: "Product-focused image with clean background, professional lighting, showcasing features and benefits",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  
  // New industry-specific premium templates
  {
    id: "services_consulting",
    title: "Consulting Services",
    category: "premium",
    industry: "services",
    prompt: "Create a professional Instagram ad image (1080x1080px) for a consulting service targeting business owners (30-50), inspired by Microsoft's sleek professionalism and Google's innovative clarity. Feature a confident consultant in a modern office, pointing at a glowing digital whiteboard with vibrant data visuals. Use crisp studio lighting (softbox glow), a clean glass-walled backdrop, and a tight rule-of-thirds composition. Add #3B82F6 as a dynamic screen accent and #10B981 for a subtle growth vibe (e.g., plant on desk). Ensure textures (e.g., suit fabric, glass reflections) feel tactile and real—no AI smoothing.",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: "health_wellness",
    title: "Health & Wellness",
    category: "premium",
    industry: "health",
    prompt: "Generate a vibrant Instagram ad image (1080x1080px) for a wellness brand targeting health-conscious adults (25-45), blending Nestlé's wholesome realism with Nike's empowering energy. Show a fit individual drinking from a sleek water bottle post-workout, sweat glistening under golden-hour sunlight, with a serene park backdrop. Use a macro shot for crisp details (e.g., water droplets, breathable fabric), dynamic diagonals for motion, and shallow depth of field to blur the background. Integrate #10B981 as a fresh, healthy accent (e.g., bottle cap) and #3B82F6 for a modern touch (e.g., sky hue).",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
  },
  {
    id: "education_tech",
    title: "Education Tech",
    category: "premium",
    industry: "education",
    prompt: "Design a sleek Instagram ad image (1080x1080px) for an online learning platform targeting students and professionals (18-35), inspired by Apple's minimalist elegance and Netflix's immersive storytelling. Feature a diverse student using a tablet in a cozy, modern study nook, illuminated by a warm desk lamp with a glowing screen reflecting their focus. Use soft, even lighting, a clean white background with #3B82F6 as a tech accent (e.g., tablet edge), and #10B981 for an inspiring touch (e.g., notebook).",
    thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8"
  },
  {
    id: "fintech_app",
    title: "Fintech Innovation",
    category: "premium",
    industry: "fintech",
    prompt: "Produce a futuristic Instagram ad image (1080x1080px) for a fintech app targeting tech-savvy investors (25-45), blending Tesla's visionary sleekness with Google's playful innovation. Show a young professional interacting with a holographic financial dashboard in a dark, minimalist loft, neon #3B82F6 charts glowing against a matte black wall. Use dramatic sidelight for a high-tech sheen, wide-angle composition for depth, and #10B981 as a subtle prosperity cue (e.g., plant reflection).",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
  },
  {
    id: "law_firm",
    title: "Legal Services",
    category: "premium",
    industry: "law",
    prompt: "Craft a dramatic Instagram ad image (1080x1080px) for a law firm targeting clients (30-60) seeking justice, inspired by HBO's intense storytelling and Microsoft's professional polish. Feature a sharp attorney in a tailored suit standing in a dimly lit courtroom, a gavel resting on a polished oak table in soft focus. Use moody, low-key lighting with a golden accent, a centered composition for authority, and #3B82F6 as a subtle tie or folder accent, paired with #10B981 for a calming touch (e.g., window light).",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
  },
  {
    id: "pet_products",
    title: "Pet Products",
    category: "premium",
    industry: "pet",
    prompt: "Generate a heartwarming Instagram ad image (1080x1080px) for a pet brand targeting pet owners (25-50), blending Nestlé's wholesome charm with Coca-Cola's joyful connection. Show a playful puppy chasing a premium pet toy in a sunlit backyard, grass blades catching the light with a shallow depth of field blur. Use golden-hour glow for warmth, a dynamic off-center composition, and #10B981 as a fresh, natural accent (e.g., toy color), with #3B82F6 for a modern pop (e.g., collar).",
    thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"
  },
  // Original templates continued
  {
    id: "premium_card",
    title: "Premium Card Visual",
    category: "product",
    prompt: "Generate a photorealistic image of a hand holding a sleek fintech metal card with glowing edges, set against a modern urban skyline at dusk. Add a subtle green glow (color #10B981) to emphasize financial growth. Do not include text on image. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1559526324-593bc073d938"
  },
  {
    id: "testimonial",
    title: "Real User Story",
    category: "testimonial",
    prompt: "Create an image of a diverse young professional sitting in a bright café, smiling while checking their phone with financial graphs on screen. Suggest trust and satisfaction. Soft blur background. Photorealistic. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad"
  },
  {
    id: "urgency",
    title: "Limited Time Offer",
    category: "promo",
    prompt: "Design a dynamic image of a countdown timer overlaying digital money flow into a wallet. Neon blue and green lighting. Abstract tech background. Cinematic feel. Format: 1080x1350.",
    thumbnail: "https://images.unsplash.com/photo-1511376979163-f804dff7ad7b"
  },
  {
    id: "app_preview",
    title: "Mobile Interface Hero",
    category: "product",
    prompt: "Render a stylized 3D mockup of a mobile banking app screen showing a user's crypto balance and transaction feed. Floating UI panels. Light, high-contrast theme. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1617040619263-41c5a9ca7521"
  },
  {
    id: "team_culture",
    title: "Team Culture",
    category: "hiring",
    prompt: "Generate an image of a diverse tech team in a modern office, working together and laughing. Warm natural lighting. Corporate but friendly. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
  }
];

interface MetaImagePromptGalleryProps {
  initialPrompt: string;
  onSelectPrompt: (prompt: string) => void;
}

const MetaImagePromptGallery: React.FC<MetaImagePromptGalleryProps> = ({
  initialPrompt,
  onSelectPrompt
}) => {
  const [customPrompt, setCustomPrompt] = useState(initialPrompt || "");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIndustry, setActiveIndustry] = useState<string>("all");
  
  const categories = ["all", "premium", "product", "lifestyle", "business", "promo", "testimonial", "hiring", "abstract"];
  const industries = ["all", "services", "health", "education", "fintech", "law", "pet"];
  
  const filteredTemplates = imagePromptTemplates.filter(template => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesIndustry = activeIndustry === "all" || template.industry === activeIndustry;
    
    return matchesCategory && matchesIndustry;
  });
  
  const handleSelectTemplate = (template: ImagePromptTemplate) => {
    setSelectedTemplate(template.id);
    setCustomPrompt(template.prompt);
    onSelectPrompt(template.prompt);
  };
  
  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
  };
  
  const handleApplyCustomPrompt = () => {
    setSelectedTemplate(null);
    onSelectPrompt(customPrompt);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Image className="h-4 w-4 mr-2" />
          Image Prompt Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-3">
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
            
            {activeCategory === "premium" && (
              <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {industries.map(industry => (
                  <Button
                    key={industry}
                    variant={activeIndustry === industry ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setActiveIndustry(industry)}
                  >
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  className={`h-auto py-2 px-3 justify-start text-left ${
                    selectedTemplate === template.id 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                      : ""
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start">
                    {selectedTemplate === template.id && (
                      <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-xs">{template.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {template.prompt.length > 60 
                          ? template.prompt.substring(0, 60) + "..." 
                          : template.prompt}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-2">
              <div className="text-xs font-medium">Custom Image Prompt</div>
              <Input
                value={customPrompt}
                onChange={handleCustomPromptChange}
                placeholder="Enter a custom image prompt..."
                className="text-xs"
              />
              <Button 
                size="sm"
                onClick={handleApplyCustomPrompt}
                className="w-full"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Apply Custom Prompt
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MetaImagePromptGallery;
