
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check, X, Image, Loader2 } from "lucide-react";
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

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAd(ad);
  };

  const handleInputChange = (field: keyof MetaAd, value: string) => {
    setEditedAd({ ...editedAd, [field]: value });
  };

  const displayAd = isEditing ? editedAd : ad;

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-800">Meta/Instagram Ad Variation {index + 1}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
              >
                <Check size={16} className="mr-1" /> Save
              </Button>
            </>
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
      <div className="border rounded-lg overflow-hidden mb-4 max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white p-3 border-b flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
          <div className="ml-2 flex-grow">
            <div className="font-semibold text-sm">{analysisResult.companyName}</div>
            <div className="text-xs text-gray-500">Sponsored</div>
          </div>
          <div className="text-gray-500">•••</div>
        </div>
        
        {/* Image */}
        <div className="bg-gray-100 aspect-square relative">
          {displayAd.imageUrl ? (
            <img 
              src={displayAd.imageUrl} 
              alt={displayAd.headline}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <Image size={40} className="text-gray-400 mb-2" />
              {loadingImageIndex === index ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-4 w-4 animate-spin mb-1" />
                  <span className="text-sm text-gray-500">Generating image...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 text-center mb-2">No image generated yet</p>
                  <Button 
                    size="sm" 
                    onClick={() => onGenerateImage(displayAd, index)}
                    disabled={loadingImageIndex !== null}
                  >
                    Generate Image
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Caption */}
        <div className="bg-white p-3">
          <div className="flex items-center space-x-4 mb-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 8.7-8.7a.97.97 0 0 1 1.41 0l6.89 6.89" /><path d="M13 13.8 21 21" /><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
          </div>
          
          <div>
            <span className="font-semibold text-sm">{analysisResult.companyName}</span>
            <span className="text-sm"> {displayAd.primaryText}</span>
          </div>
          
          <div className="mt-1 text-sm">
            <span className="font-semibold">{displayAd.headline}</span>
            <span className="text-gray-500"> {displayAd.description}</span>
          </div>
          
          <div className="mt-2">
            <button className="w-full py-1.5 rounded bg-[#0095f6] text-white font-semibold text-sm">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Ad Details - Editable in edit mode */}
      <div className="space-y-3 text-sm mt-4">
        <div>
          <span className="font-medium text-gray-700">Primary Text:</span>
          {isEditing ? (
            <Textarea
              value={editedAd.primaryText}
              onChange={(e) => handleInputChange('primaryText', e.target.value)}
              className="mt-1 text-sm min-h-[80px]"
              rows={3}
              maxLength={125}
              placeholder="Main caption for your ad"
            />
          ) : (
            <p className="mt-1 pl-2 text-gray-600">{displayAd.primaryText}</p>
          )}
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Headline:</span>
          {isEditing ? (
            <Input
              value={editedAd.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="mt-1 text-sm"
              maxLength={40}
              placeholder="Bold headline text"
            />
          ) : (
            <p className="mt-1 pl-2 text-gray-600">{displayAd.headline}</p>
          )}
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Description:</span>
          {isEditing ? (
            <Input
              value={editedAd.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 text-sm"
              maxLength={30}
              placeholder="Brief description text"
            />
          ) : (
            <p className="mt-1 pl-2 text-gray-600">{displayAd.description}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Image Prompt:</span>
            {!isEditing && displayAd.imageUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onGenerateImage(displayAd, index)}
                disabled={loadingImageIndex !== null}
              >
                Regenerate Image
              </Button>
            )}
          </div>
          {isEditing ? (
            <Textarea
              value={editedAd.imagePrompt}
              onChange={(e) => handleInputChange('imagePrompt', e.target.value)}
              className="mt-1 text-sm min-h-[80px]"
              rows={3}
              placeholder="Detailed description of the image you want to generate"
            />
          ) : (
            <p className="mt-1 pl-2 text-xs text-gray-500">{displayAd.imagePrompt}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaAdCard;
