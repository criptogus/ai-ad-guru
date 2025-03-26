
import React from "react";
import { ImageIcon } from "lucide-react";

interface TemplateGalleryButtonProps {
  onClick: () => void;
}

const TemplateGalleryButton: React.FC<TemplateGalleryButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors"
    >
      <ImageIcon className="h-3 w-3" />
      Template
    </button>
  );
};

export default TemplateGalleryButton;
