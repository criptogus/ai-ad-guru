
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import TemplateGallery, { AdTemplate } from "../../template-gallery/TemplateGallery";

interface TemplateGalleryButtonProps {
  onSelectTemplate: (template: AdTemplate) => void;
  platform?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const TemplateGalleryButton: React.FC<TemplateGalleryButtonProps> = ({
  onSelectTemplate,
  platform = "instagram",
  variant = "outline",
  size = "sm",
  className = ""
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleOpenGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleSelectTemplate = (template: AdTemplate) => {
    onSelectTemplate(template);
    setIsGalleryOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenGallery}
        className={className}
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        Template Gallery
      </Button>

      <TemplateGallery
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        onSelectTemplate={handleSelectTemplate}
        platform={platform}
      />
    </>
  );
};

export default TemplateGalleryButton;
