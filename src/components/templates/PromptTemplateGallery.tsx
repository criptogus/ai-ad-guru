
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { usePromptTemplates, PromptTemplate } from '@/hooks/template/usePromptTemplates';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className={`${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-4">
          <TabsList className="mb-4 w-full h-auto flex flex-wrap">
            <TabsTrigger value="all" className="mb-1">All Templates</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="mb-1">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-md">{template.title}</CardTitle>
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
                            onClick={(e) => handleDeleteTemplate(e, template)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {template.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm line-clamp-3">
                      {template.prompt_text.substring(0, 150)}
                      {template.prompt_text.length > 150 && '...'}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-2">
                    <Button size="sm" variant="secondary" className="w-full">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptTemplateGallery;
