
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, CheckCircle2, Filter, BookTemplate } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TextAdTemplate, textAdTemplates, getTextAdCategories, getTextAdIndustries } from "@/data/textAdTemplates";
import { Badge } from "@/components/ui/badge";

interface TextAdTemplateGalleryProps {
  initialHeadline1?: string;
  initialHeadline2?: string;
  initialHeadline3?: string;
  initialDescription1?: string;
  initialDescription2?: string;
  platform: "google" | "microsoft";
  onSelectTemplate: (template: TextAdTemplate) => void;
}

const TextAdTemplateGallery: React.FC<TextAdTemplateGalleryProps> = ({
  initialHeadline1 = "",
  initialHeadline2 = "",
  initialHeadline3 = "",
  initialDescription1 = "",
  initialDescription2 = "",
  platform,
  onSelectTemplate
}) => {
  const [customHeadline1, setCustomHeadline1] = useState(initialHeadline1);
  const [customHeadline2, setCustomHeadline2] = useState(initialHeadline2);
  const [customHeadline3, setCustomHeadline3] = useState(initialHeadline3);
  const [customDescription1, setCustomDescription1] = useState(initialDescription1);
  const [customDescription2, setCustomDescription2] = useState(initialDescription2);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIndustry, setActiveIndustry] = useState<string>("all");
  
  const categories = ["all", ...getTextAdCategories()];
  const industries = ["all", ...getTextAdIndustries()];
  
  const filteredTemplates = textAdTemplates.filter(template => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesIndustry = activeIndustry === "all" || template.industry === activeIndustry;
    
    return matchesCategory && matchesIndustry;
  });
  
  const handleSelectTemplate = (template: TextAdTemplate) => {
    setSelectedTemplate(template.id);
    setCustomHeadline1(template.headline1);
    setCustomHeadline2(template.headline2);
    setCustomHeadline3(template.headline3 || "");
    setCustomDescription1(template.description1);
    setCustomDescription2(template.description2 || "");
    onSelectTemplate(template);
  };
  
  const handleApplyCustomText = () => {
    const customTemplate: TextAdTemplate = {
      id: "custom",
      title: "Custom",
      category: "custom",
      headline1: customHeadline1,
      headline2: customHeadline2,
      headline3: customHeadline3,
      description1: customDescription1,
      description2: customDescription2
    };
    
    setSelectedTemplate(null);
    onSelectTemplate(customTemplate);
  };

  const platformDisplay = platform === "google" ? "Google" : "Microsoft";

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <BookTemplate className="h-4 w-4 mr-2" />
          {platformDisplay} Ad Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Text</TabsTrigger>
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
                  <div className="flex items-start w-full">
                    {selectedTemplate === template.id && (
                      <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="w-full">
                      <div className="font-medium text-xs flex items-center justify-between">
                        <span>{template.title}</span>
                        {template.isQuestion && (
                          <Badge variant="outline" className="text-xs ml-1 py-0">Q</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {template.headline1} | {template.headline2}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <div className="text-xs font-medium mb-1">Headline 1 (30 chars max)</div>
                  <Input
                    value={customHeadline1}
                    onChange={(e) => setCustomHeadline1(e.target.value)}
                    placeholder="Enter headline 1..."
                    className="text-xs"
                    maxLength={30}
                  />
                  <div className="text-xs text-muted-foreground mt-0.5">{customHeadline1.length}/30</div>
                </div>
                
                <div>
                  <div className="text-xs font-medium mb-1">Headline 2 (30 chars max)</div>
                  <Input
                    value={customHeadline2}
                    onChange={(e) => setCustomHeadline2(e.target.value)}
                    placeholder="Enter headline 2..."
                    className="text-xs"
                    maxLength={30}
                  />
                  <div className="text-xs text-muted-foreground mt-0.5">{customHeadline2.length}/30</div>
                </div>
                
                <div>
                  <div className="text-xs font-medium mb-1">Headline 3 (30 chars max)</div>
                  <Input
                    value={customHeadline3}
                    onChange={(e) => setCustomHeadline3(e.target.value)}
                    placeholder="Enter headline 3..."
                    className="text-xs"
                    maxLength={30}
                  />
                  <div className="text-xs text-muted-foreground mt-0.5">{customHeadline3.length}/30</div>
                </div>
                
                <div>
                  <div className="text-xs font-medium mb-1">Description 1 (90 chars max)</div>
                  <Input
                    value={customDescription1}
                    onChange={(e) => setCustomDescription1(e.target.value)}
                    placeholder="Enter description 1..."
                    className="text-xs"
                    maxLength={90}
                  />
                  <div className="text-xs text-muted-foreground mt-0.5">{customDescription1.length}/90</div>
                </div>
                
                <div>
                  <div className="text-xs font-medium mb-1">Description 2 (90 chars max)</div>
                  <Input
                    value={customDescription2}
                    onChange={(e) => setCustomDescription2(e.target.value)}
                    placeholder="Enter description 2..."
                    className="text-xs"
                    maxLength={90}
                  />
                  <div className="text-xs text-muted-foreground mt-0.5">{customDescription2.length}/90</div>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={handleApplyCustomText}
                className="w-full"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Apply Custom Text
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TextAdTemplateGallery;
