
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MetaAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdate?: (index: number, updatedAd: MetaAd) => void;
}

const MetaAdCard: React.FC<MetaAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult, 
  loadingImageIndex, 
  onGenerateImage,
  onUpdate
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard",
      duration: 2000,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(index, editedAd);
    }
    toast({
      title: "Ad Updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const handleInputChange = (field: keyof MetaAd, value: string) => {
    setEditedAd({ ...editedAd, [field]: value });
  };

  const displayAd = isEditing ? editedAd : ad;

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">Meta/Instagram Ad Variation {index + 1}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
            >
              <Check size={16} className="mr-1" /> Save
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(`${displayAd.headline}\n\n${displayAd.primaryText}\n\n${displayAd.description}`)}
              >
                <Copy size={16} className="mr-1" /> Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
              >
                <Edit size={16} className="mr-1" /> Edit
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Instagram Ad Preview */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium text-gray-800 mb-1">{analysisResult.companyName}</div>
            <p className="text-sm mb-2">{displayAd.primaryText}</p>
            <div className="font-medium text-sm">{displayAd.headline}</div>
            <div className="text-xs text-gray-600">{displayAd.description}</div>
          </div>
        </div>
        
        <div className="w-full md:w-48 flex-shrink-0">
          {displayAd.imageUrl ? (
            <div className="relative bg-gray-100 rounded-md overflow-hidden aspect-square">
              <img 
                src={displayAd.imageUrl} 
                alt={displayAd.headline} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-md h-full flex flex-col items-center justify-center p-4 aspect-square">
              <p className="text-sm text-gray-500 text-center mb-2">AI image can be generated based on ad content</p>
              <Button 
                size="sm" 
                onClick={() => onGenerateImage(displayAd, index)}
                disabled={loadingImageIndex !== null}
              >
                {loadingImageIndex === index ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Ad Details - Editable in edit mode */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Primary Text:</span>
          {isEditing ? (
            <Textarea
              value={editedAd.primaryText}
              onChange={(e) => handleInputChange('primaryText', e.target.value)}
              className="mt-1 text-sm"
              rows={2}
            />
          ) : (
            <p className="pl-2">{displayAd.primaryText}</p>
          )}
        </div>
        <div>
          <span className="font-medium">Headline:</span>
          {isEditing ? (
            <Input
              value={editedAd.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="mt-1 text-sm"
            />
          ) : (
            <p className="pl-2">{displayAd.headline}</p>
          )}
        </div>
        <div>
          <span className="font-medium">Description:</span>
          {isEditing ? (
            <Input
              value={editedAd.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 text-sm"
            />
          ) : (
            <p className="pl-2">{displayAd.description}</p>
          )}
        </div>
        <div>
          <span className="font-medium">Image Prompt:</span>
          {isEditing ? (
            <Textarea
              value={editedAd.imagePrompt}
              onChange={(e) => handleInputChange('imagePrompt', e.target.value)}
              className="mt-1 text-sm"
              rows={2}
            />
          ) : (
            <p className="pl-2 text-xs text-gray-600">{displayAd.imagePrompt}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaAdCard;
