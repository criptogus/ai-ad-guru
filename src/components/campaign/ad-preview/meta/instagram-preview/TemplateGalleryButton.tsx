
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import InstagramTemplateGallery from "../instagram-templates/InstagramTemplateGallery";

interface TemplateGalleryButtonProps {
  onSelectTemplate: (template: string) => void;
}

const TemplateGalleryButton: React.FC<TemplateGalleryButtonProps> = ({
  onSelectTemplate
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="w-full mt-2"
        onClick={() => setIsGalleryOpen(true)}
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        AI Template Gallery
      </Button>
      
      <InstagramTemplateGallery 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectTemplate={onSelectTemplate}
      />
    </>
  );
};

export default TemplateGalleryButton;
