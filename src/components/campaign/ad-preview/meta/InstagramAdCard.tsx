
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  Pencil,
  Check,
  X,
  Trash2,
  Copy
} from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { InstagramPreview } from "./instagram-preview";

interface InstagramAdCardProps {
  ad: MetaAd;
  companyName?: string;
  index: number;
  isEditing?: boolean;
  isSelected?: boolean;
  isGeneratingImage?: boolean;
  loadingImageIndex?: number | null;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onSelect?: () => void;
  onUnselect?: () => void;
  onRegenerate?: () => void;
  onGenerateImage?: () => Promise<void>;
  onDelete?: () => void;
  onCopy?: () => void;
  onChange?: (ad: MetaAd) => void;
}

const InstagramAdCard: React.FC<InstagramAdCardProps> = ({
  ad,
  companyName = "Your Company",
  index,
  isEditing = false,
  isSelected = false,
  isGeneratingImage = false,
  loadingImageIndex = null,
  onEdit,
  onSave,
  onCancel,
  onSelect,
  onUnselect,
  onRegenerate,
  onGenerateImage,
  onDelete,
  onCopy,
  onChange
}) => {
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAd(prev => ({ ...prev, [name]: value }));
    
    if (onChange) {
      onChange({ ...editedAd, [name]: value });
    }
  };
  
  // Ensure the image generation function returns a Promise
  const handleGenerateImage = async (): Promise<void> => {
    if (onGenerateImage) {
      return onGenerateImage();
    }
    return Promise.resolve();
  };
  
  const isLoading = isGeneratingImage || loadingImageIndex === index;
  
  return (
    <Card className={`overflow-hidden border ${
      isSelected ? "border-primary ring-2 ring-primary/20" : "border-border"
    }`}>
      <div className="bg-muted p-3 border-b border-border flex justify-between items-center">
        <div className="text-sm font-medium">Instagram Ad {index + 1}</div>
        
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onSave}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              {onCopy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="flex flex-col items-center p-4">
          <InstagramPreview
            ad={isEditing ? editedAd : ad}
            companyName={companyName}
            index={index}
            loadingImageIndex={loadingImageIndex}
            onGenerateImage={handleGenerateImage}
          />
        </div>
      </CardContent>
      
      {!isEditing && (
        <div className="bg-card p-3 border-t border-border flex justify-between">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
            >
              <RotateCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default InstagramAdCard;
