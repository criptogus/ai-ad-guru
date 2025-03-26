
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Save, X } from "lucide-react";
import LinkedInAdPreview from "./LinkedInAdPreview";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LinkedInAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage: boolean;
  isEditing?: boolean;
  onGenerateImage: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  onEdit?: () => void;
  onSave?: (updatedAd: MetaAd) => void;
  onCancel?: () => void;
  onCopy?: () => void;
}

const LinkedInAdCard: React.FC<LinkedInAdCardProps> = ({
  ad,
  index,
  analysisResult,
  isGeneratingImage,
  isEditing: externalIsEditing,
  onGenerateImage,
  onUpdateAd,
  onEdit,
  onSave,
  onCancel,
  onCopy
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);
  
  // Use external editing state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      const adText = `Headline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\nDescription: ${ad.description}`;
      navigator.clipboard.writeText(adText);
    }
  };

  const handleEditToggle = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalIsEditing(!internalIsEditing);
      // Reset to original if canceling edit
      if (internalIsEditing) {
        setEditedAd(ad);
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedAd);
    } else if (onUpdateAd) {
      onUpdateAd(editedAd);
      setInternalIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalIsEditing(false);
      setEditedAd(ad);
    }
  };

  const handleChange = (field: keyof MetaAd, value: string) => {
    setEditedAd(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="text-sm font-medium">LinkedIn Ad {index + 1}</div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEditToggle}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <LinkedInAdPreview 
              ad={isEditing ? editedAd : ad}
              analysisResult={analysisResult}
              isGeneratingImage={isGeneratingImage}
              onGenerateImage={onGenerateImage}
              onUpdateAd={onUpdateAd}
            />
          </div>
          
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Headline</label>
                  <Input 
                    value={editedAd.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    maxLength={70}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editedAd.headline?.length || 0}/70 characters
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Text</label>
                  <Textarea 
                    value={editedAd.primaryText}
                    onChange={(e) => handleChange('primaryText', e.target.value)}
                    maxLength={150}
                    rows={3}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editedAd.primaryText?.length || 0}/150 characters
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Input 
                    value={editedAd.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    maxLength={30}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editedAd.description?.length || 0}/30 characters
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Image Prompt (for AI generation)</label>
                  <Textarea 
                    value={editedAd.imagePrompt}
                    onChange={(e) => handleChange('imagePrompt', e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="text-sm font-medium">Headline</h4>
                  <p className="text-sm">{ad.headline}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Primary Text</h4>
                  <p className="text-sm">{ad.primaryText}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm">{ad.description}</p>
                </div>
                
                {ad.imagePrompt && (
                  <div>
                    <h4 className="text-sm font-medium">Image Prompt</h4>
                    <p className="text-xs text-gray-500">{ad.imagePrompt}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdCard;
