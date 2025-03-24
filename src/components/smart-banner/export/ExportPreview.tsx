
import React from "react";
import { BannerElement } from "@/hooks/smart-banner/types";

interface ExportPreviewProps {
  backgroundImage: string | null;
  bannerElements: BannerElement[];
}

const ExportPreview: React.FC<ExportPreviewProps> = ({
  backgroundImage,
  bannerElements
}) => {
  if (!backgroundImage) return null;
  
  return (
    <div className="space-y-4">
      <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100">
        <img
          src={backgroundImage}
          alt="Banner Preview"
          className="w-full h-full object-cover"
        />
        
        {bannerElements.map(element => {
          if (element.type === 'text') {
            return (
              <div 
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  transform: `translate(-50%, -50%)`,
                  color: element.color || 'black',
                  fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                  fontWeight: element.fontWeight || 'normal'
                }}
              >
                {element.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ExportPreview;
