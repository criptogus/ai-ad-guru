import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { InstagramPreview } from "./instagram-preview";
import { Edit, Save, X, Copy, Loader2 } from "lucide-react";
import InstagramAdEditor from "./InstagramAdEditor";
import TriggerButtonInline from "../TriggerButtonInline";

interface MetaAdCardProps {
  index: number;
  ad: MetaAd;
  companyName: string;
  isEditing: boolean;
  isGeneratingImage: boolean;
  onEdit: () => void;
  onSave: (updatedAd: MetaAd) => void;
  onCancel: () => void;
  onCopy: () => void;
  onGenerateImage: () => void;
}

const MetaAdCard: React.FC<MetaAdCardProps> = ({
  index,
  ad,
  companyName,
  isEditing,
  isGeneratingImage,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onGenerateImage,
}) => {
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);

  useEffect(() => {
    setEditedAd(ad);
  }, [ad]);

  const handleChange = (field: keyof MetaAd, value: string) => {
    setEditedAd({ ...editedAd, [field]: value });
  };

  const handleSelectTrigger = (trigger: string) => {
    // If we're editing, add the trigger to the primaryText
    if (isEditing) {
      setEditedAd({
        ...editedAd,
        primaryText: editedAd.primaryText 
          ? `${editedAd.primaryText}\n\n${trigger}`
          : trigger
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex justify-between items-center bg-muted p-3 border-b">
          <h3 className="text-sm font-medium">Instagram Ad #{index + 1}</h3>
          <div className="flex gap-2">
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
                  onClick={() => onSave(editedAd)}
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
                  onClick={onCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ad Content */}
        <div className="grid md:grid-cols-2 gap-4 p-4">
          {/* Instagram Preview */}
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden bg-white">
              {/* Instagram Header */}
              <div className="flex items-center p-2 border-b">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="ml-2">
                  <p className="text-sm font-semibold">{companyName}</p>
                  <p className="text-xs text-gray-500">Sponsored</p>
                </div>
              </div>

              {/* Instagram Image */}
              {ad.imageUrl ? (
                <img 
                  src={ad.imageUrl} 
                  alt="Instagram Ad" 
                  className="w-full aspect-square object-cover" 
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  {isGeneratingImage ? (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 mx-auto animate-spin text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Generating image...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">No image generated yet</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onGenerateImage} 
                        className="mt-2"
                      >
                        Generate Image
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Instagram Caption */}
              <div className="p-3">
                <p className="text-sm font-semibold mb-1">{companyName}</p>
                <p className="text-sm whitespace-pre-line">{ad.primaryText}</p>
                <p className="text-sm text-blue-500 mt-1">{ad.description || "Learn More"}</p>
              </div>
            </div>

            {/* Regenerate Image Button */}
            {ad.imageUrl && !isGeneratingImage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onGenerateImage} 
                className="w-full"
              >
                <Image className="h-4 w-4 mr-2" />
                Regenerate Image
              </Button>
            )}
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Headline</p>
              {isEditing ? (
                <Input 
                  value={editedAd.headline} 
                  onChange={(e) => handleChange("headline", e.target.value)}
                  placeholder="Enter headline (25 chars max)"
                  maxLength={25}
                />
              ) : (
                <p className="text-sm border p-2 rounded-md bg-muted/20">{ad.headline}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">Primary Text</p>
                {isEditing && (
                  <TriggerButtonInline onSelectTrigger={handleSelectTrigger} />
                )}
              </div>
              {isEditing ? (
                <Textarea 
                  value={editedAd.primaryText} 
                  onChange={(e) => handleChange("primaryText", e.target.value)}
                  placeholder="Enter primary text (125 chars recommended)"
                  rows={5}
                />
              ) : (
                <div className="text-sm border p-2 rounded-md bg-muted/20 whitespace-pre-line min-h-[100px]">
                  {ad.primaryText}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Call to Action</p>
              {isEditing ? (
                <Input 
                  value={editedAd.description || ""} 
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter CTA (e.g., 'Learn More', 'Shop Now')"
                  maxLength={20}
                />
              ) : (
                <p className="text-sm border p-2 rounded-md bg-muted/20">{ad.description || "Learn More"}</p>
              )}
            </div>

            {isEditing && (
              <div>
                <p className="text-sm font-medium mb-1">Image Prompt</p>
                <Textarea 
                  value={editedAd.imagePrompt || ""} 
                  onChange={(e) => handleChange("imagePrompt", e.target.value)}
                  placeholder="Describe the image you want to generate"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaAdCard;
