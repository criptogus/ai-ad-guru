
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Loader2, Edit, Trash2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePromptTemplates, PromptTemplate } from '@/hooks/template/usePromptTemplates';

interface PromptTemplateGalleryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
  showActions?: boolean;
  className?: string;
}

const PromptTemplateGallery: React.FC<PromptTemplateGalleryProps> = ({
  onSelectTemplate,
  showActions = false,
  className = ''
}) => {
  const {
    templates,
    categories,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    deleteTemplate
  } = usePromptTemplates();
  
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const handleSelectTemplate = (template: PromptTemplate) => {
    onSelectTemplate(template);
  };
  
  const handleDeleteTemplate = async (e: React.MouseEvent, template: PromptTemplate) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(template.id);
    }
  };
  
  const filteredTemplates = activeTab === 'all'
    ? templates
    : templates.filter(t => t.category === activeTab);

  // Group templates by category for the "All Templates" view
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, PromptTemplate[]>);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error: {error}</p>
        <Button variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full h-auto flex flex-wrap justify-start">
          <TabsTrigger value="all" className="mb-1 mr-1">All Templates</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="mb-1 mr-1">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="space-y-8">
            {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="outline" className="text-xs">
                    {categoryTemplates.length} templates
                  </Badge>
                </div>
                
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {categoryTemplates.map((template) => (
                      <CarouselItem key={template.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <TemplateCard 
                          template={template}
                          onSelect={handleSelectTemplate}
                          onDelete={handleDeleteTemplate}
                          showActions={showActions}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-end gap-2 mt-2">
                    <CarouselPrevious className="relative static left-0 right-0 translate-y-0" />
                    <CarouselNext className="relative static left-0 right-0 translate-y-0" />
                  </div>
                </Carousel>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates
                .filter(t => t.category === category)
                .map((template) => (
                  <TemplateCard 
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    onDelete={handleDeleteTemplate}
                    showActions={showActions}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface TemplateCardProps {
  template: PromptTemplate;
  onSelect: (template: PromptTemplate) => void;
  onDelete: (e: React.MouseEvent, template: PromptTemplate) => void;
  showActions: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onSelect, 
  onDelete,
  showActions 
}) => {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors h-full flex flex-col"
      onClick={() => onSelect(template)}
    >
      <CardHeader className="p-4 pb-2 flex-shrink-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md line-clamp-1">{template.title}</CardTitle>
          {showActions && template.editable && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  // Edit functionality would go here
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive" 
                onClick={(e) => onDelete(e, template)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Badge variant="outline" className="w-fit">
          <Tag className="h-3 w-3 mr-1" />
          {template.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm line-clamp-3 text-muted-foreground">
          {template.prompt_text.substring(0, 150)}
          {template.prompt_text.length > 150 && '...'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex-shrink-0">
        <Button size="sm" variant="secondary" className="w-full">
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptTemplateGallery;
