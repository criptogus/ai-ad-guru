
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";

interface GeneratedImagePreviewProps {
  selectedTemplate: InstagramTemplate | null;
  generatedImageUrl: string | null;
  isLoading: boolean;
}

const GeneratedImagePreview: React.FC<GeneratedImagePreviewProps> = ({
  selectedTemplate,
  generatedImageUrl,
  isLoading,
}) => {
  if (!selectedTemplate) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Preview: {selectedTemplate.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
          </div>
          
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt={`Generated image for ${selectedTemplate.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <span>No image generated yet</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratedImagePreview;
