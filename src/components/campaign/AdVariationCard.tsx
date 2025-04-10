
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Copy, 
  Check, 
  X, 
  RotateCw, 
  Trash, 
  CopyPlus 
} from "lucide-react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { InstagramPreview } from "@/components/campaign/ad-preview/meta";
import GoogleAdPreview from "@/components/campaign/ad-preview/google/GoogleAdPreview";
import GoogleAdDetails from "@/components/campaign/ad-preview/google/GoogleAdDetails";
import { MicrosoftAdPreview } from "@/components/campaign/ad-preview/microsoft";
import LinkedInAdPreview from "@/components/campaign/ad-preview/linkedin/LinkedInAdPreview";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AdVariationCardProps {
  platform: 'google' | 'meta' | 'linkedin' | 'microsoft';
  ad: any; // Using any here for flexibility across platforms
  analysisResult?: WebsiteAnalysisResult;
  isEditing?: boolean;
  index?: number;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onCopy?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onRegenerate?: () => void;
  onUpdate?: (updatedAd: any) => void;
}

const AdVariationCard: React.FC<AdVariationCardProps> = ({
  platform,
  ad,
  analysisResult,
  isEditing = false,
  index = 0,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onDuplicate,
  onDelete,
  onRegenerate,
  onUpdate
}) => {
  const [editedAd, setEditedAd] = useState(ad);
  
  const handleUpdate = (newAdData: any) => {
    setEditedAd(newAdData);
    if (onUpdate) {
      onUpdate(newAdData);
    }
  };
  
  // Extract domain from website URL
  const getDomain = (url?: string) => {
    if (!url) return 'example.com';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };
  
  const companyName = analysisResult?.companyName || "Your Company";
  const domain = getDomain(analysisResult?.websiteUrl);

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/40">
        <div className="text-sm font-medium">
          Variation {index + 1}
        </div>
        
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onSave}
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onCopy}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {onDuplicate && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={onDuplicate}
                  title="Duplicate ad"
                >
                  <CopyPlus className="h-4 w-4" />
                </Button>
              )}
              {onRegenerate && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={onRegenerate}
                  title="Regenerate ad"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onEdit}
                title="Edit ad"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive" 
                  onClick={onDelete}
                  title="Delete ad"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview Section */}
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Preview</div>
            <div className="border rounded-lg p-3 bg-background flex justify-center">
              {platform === 'google' && <GoogleAdPreview ad={ad} domain={domain} />}
              {platform === 'meta' && <InstagramPreview ad={ad} companyName={companyName} />}
              {platform === 'microsoft' && <MicrosoftAdPreview ad={ad} domain={domain} />}
              {platform === 'linkedin' && analysisResult && (
                <LinkedInAdPreview ad={ad} analysisResult={analysisResult} />
              )}
            </div>
          </div>
          
          {/* Editor Section */}
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Content</div>
            <div className="border rounded-lg p-3 bg-background">
              {platform === 'google' && (
                <GoogleAdDetails 
                  ad={isEditing ? editedAd : ad} 
                  onUpdateAd={handleUpdate} 
                  isEditing={isEditing} 
                />
              )}
              {/* Add equivalent editors for other platforms */}
              {platform !== 'google' && (
                <div className="space-y-4">
                  {Object.entries(ad).map(([key, value]) => {
                    if (key === 'imageUrl' || key === 'imagePrompt' || key === 'format' || key === 'hashtags') return null;
                    
                    return (
                      <div key={key}>
                        <div className="text-xs font-medium capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                        {isEditing ? (
                          <textarea
                            className="w-full p-2 border rounded-md text-sm resize-none"
                            value={String(value)}
                            rows={key === 'primaryText' ? 4 : 2}
                            readOnly={!isEditing}
                            onChange={(e) => {
                              if (onUpdate) {
                                handleUpdate({
                                  ...editedAd,
                                  [key]: e.target.value
                                });
                              }
                            }}
                          />
                        ) : (
                          <div className="text-sm border rounded-md p-2 bg-muted/20">
                            {String(value)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdVariationCard;
