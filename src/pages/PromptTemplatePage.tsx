
import React, { useState } from 'react';
import SafeAppLayout from '@/components/SafeAppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePromptTemplates, PromptTemplate } from '@/hooks/template/usePromptTemplates';
import { useGPT4oImageGeneration } from '@/hooks/adGeneration/useGPT4oImageGeneration';
import PromptTemplateGallery from '@/components/templates/PromptTemplateGallery';
import PromptTemplateForm from '@/components/templates/PromptTemplateForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PromptTemplatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [brandTone, setBrandTone] = useState('professional');
  
  const { templates, isLoading } = usePromptTemplates();
  const imageGeneration = useGPT4oImageGeneration();
  
  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('editor');
  };
  
  const handleBackToGallery = () => {
    setActiveTab('gallery');
  };

  return (
    <SafeAppLayout activePage="tools">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">GPT-4o Ad Image Generator</h1>
          <p className="text-muted-foreground">
            Create professional ad images with text using prompt templates and GPT-4o
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Brand Details</CardTitle>
              <CardDescription>
                These details will be used to customize your generated images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. E-commerce, Finance, Healthcare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandTone">Brand Tone</Label>
                <Input 
                  id="brandTone" 
                  value={brandTone}
                  onChange={(e) => setBrandTone(e.target.value)}
                  placeholder="e.g. Professional, Playful, Luxurious"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="gallery">Template Gallery</TabsTrigger>
                <TabsTrigger value="editor">Image Editor</TabsTrigger>
                <TabsTrigger value="history">Generation History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="mt-0">
                <PromptTemplateGallery 
                  onSelectTemplate={handleSelectTemplate}
                  showActions={false}
                />
              </TabsContent>
              
              <TabsContent value="editor" className="mt-0">
                <PromptTemplateForm 
                  template={selectedTemplate}
                  imageGeneration={imageGeneration}
                  onSelectNewTemplate={handleBackToGallery}
                  companyName={companyName}
                  industry={industry}
                  brandTone={brandTone}
                />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Generation History</CardTitle>
                    <CardDescription>
                      View your previously generated images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Coming soon: A history of your generated images will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SafeAppLayout>
  );
};

export default PromptTemplatePage;
