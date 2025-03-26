
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTemplatesByPlatform, adTemplateCategories } from "./adTemplateData";

export interface AdTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  platform: string;
  dimensions?: { width: number; height: number };
}

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AdTemplate) => void;
  platform: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  platform,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<AdTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setTemplates(getTemplatesByPlatform(platform));
  }, [platform]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectTemplate = (template: AdTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const filteredTemplates = templates.filter(
    (template) =>
      (activeTab === "all" || template.category === activeTab) &&
      (searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get categories for this platform
  const categoriesForPlatform = adTemplateCategories.filter(cat => 
    templates.some(template => template.category === cat.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Ad Template Gallery</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {categoriesForPlatform.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ScrollArea className="flex-1 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="bg-muted rounded-md p-3 h-20 overflow-y-auto text-xs">
                    {template.prompt.substring(0, 150)}
                    {template.prompt.length > 150 && "..."}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No templates found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;
