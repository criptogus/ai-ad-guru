
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InstagramTemplateGallery, { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";

interface TemplateGallerySectionProps {
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const TemplateGallerySection: React.FC<TemplateGallerySectionProps> = ({
  onSelectTemplate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Template</CardTitle>
      </CardHeader>
      <CardContent>
        <InstagramTemplateGallery onSelectTemplate={onSelectTemplate} />
      </CardContent>
    </Card>
  );
};

export default TemplateGallerySection;
