
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GridIcon, Loader2 } from "lucide-react";

interface UserImageBankProps {
  images: string[];
  onSelectImage: (imageUrl: string) => void;
  isLoading: boolean;
}

const UserImageBank: React.FC<UserImageBankProps> = ({ 
  images, 
  onSelectImage,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-md">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading your images...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-md">
        <div className="text-center">
          <GridIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <p className="mt-2 text-muted-foreground">No images in your bank yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Generate or upload images to build your collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Your Image Bank</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((imageUrl, index) => (
          <Card 
            key={`${imageUrl}-${index}`}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
            onClick={() => onSelectImage(imageUrl)}
          >
            <div className="aspect-square relative">
              <img 
                src={imageUrl} 
                alt={`Bank image ${index + 1}`}
                className="w-full h-full object-cover" 
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserImageBank;
