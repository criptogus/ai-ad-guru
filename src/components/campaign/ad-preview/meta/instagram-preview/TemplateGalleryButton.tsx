
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";

interface TemplateGalleryButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const TemplateGalleryButton: React.FC<TemplateGalleryButtonProps> = ({ 
  onClick, 
  disabled = false 
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-3"
      onClick={onClick}
      disabled={disabled}
    >
      <LayoutTemplate className="mr-2 h-4 w-4" />
      Choose Template
    </Button>
  );
};

export default TemplateGalleryButton;
