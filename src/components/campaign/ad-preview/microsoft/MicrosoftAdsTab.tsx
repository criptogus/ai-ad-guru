
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MicrosoftAdEditor from "./MicrosoftAdEditor";
import MicrosoftAdPreview from "./MicrosoftAdPreview";
import EmptyAdsState from "../EmptyAdsState";
import TriggerGallery from "@/components/mental-triggers/TriggerGallery";
import { getDomain } from "@/lib/utils";

interface MicrosoftAdsTabProps {
  ads: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onUpdateAd: (index: number, updatedAd: GoogleAd) => void;
  onMindTriggerChange?: (trigger: string) => void;
  mindTrigger?: string;
  onGenerate?: () => Promise<void>;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({
  ads,
  analysisResult,
  isGenerating,
  onUpdateAd,
  onMindTriggerChange,
  mindTrigger,
  onGenerate
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showTriggerGallery, setShowTriggerGallery] = useState(false);
  const domain = getDomain(analysisResult?.websiteUrl || "example.com");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number, updatedAd: GoogleAd) => {
    onUpdateAd(index, updatedAd);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleHeadlineChange = (adIndex: number, headlineIndex: number, value: string) => {
    const ad = ads[adIndex];
    
    // Create a new ad object with updated headlines array
    const updatedAd = { ...ad };
    
    // Make sure headlines array exists
    if (!updatedAd.headlines) {
      updatedAd.headlines = [
        updatedAd.headline1 || '',
        updatedAd.headline2 || '',
        updatedAd.headline3 || ''
      ];
    }
    
    // Update the specific headline
    const headlines = [...updatedAd.headlines];
    headlines[headlineIndex] = value;
    updatedAd.headlines = headlines;
    
    // Also update the individual headline property
    if (headlineIndex === 0) updatedAd.headline1 = value;
    if (headlineIndex === 1) updatedAd.headline2 = value;
    if (headlineIndex === 2) updatedAd.headline3 = value;
    
    onUpdateAd(adIndex, updatedAd);
  };

  const handleDescriptionChange = (adIndex: number, descIndex: number, value: string) => {
    const ad = ads[adIndex];
    
    // Create a new ad object with updated descriptions array
    const updatedAd = { ...ad };
    
    // Make sure descriptions array exists
    if (!updatedAd.descriptions) {
      updatedAd.descriptions = [
        updatedAd.description1 || '',
        updatedAd.description2 || ''
      ];
    }
    
    // Update the specific description
    const descriptions = [...updatedAd.descriptions];
    descriptions[descIndex] = value;
    updatedAd.descriptions = descriptions;
    
    // Also update the individual description property
    if (descIndex === 0) updatedAd.description1 = value;
    if (descIndex === 1) updatedAd.description2 = value;
    
    onUpdateAd(adIndex, updatedAd);
  };

  const handleSelectTrigger = (trigger: string) => {
    if (onMindTriggerChange) {
      onMindTriggerChange(trigger);
      setShowTriggerGallery(false);
    }
  };

  if (ads.length === 0) {
    return (
      <EmptyAdsState 
        platform="microsoft" 
        onGenerate={onGenerate}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Mind Trigger Section */}
      {onMindTriggerChange && (
        <div className="flex items-center justify-between mb-4 p-4 bg-muted/30 border rounded-lg">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">Mind Trigger</h3>
            <p className="text-sm text-muted-foreground">
              {mindTrigger ? `Using: ${mindTrigger}` : "No mind trigger applied"}
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowTriggerGallery(true)}
          >
            {mindTrigger ? "Change Trigger" : "Add Trigger"}
          </Button>
        </div>
      )}

      {/* Microsoft Ads */}
      {ads.map((ad, index) => (
        <Card key={index}>
          <CardContent className="p-0">
            <div className="flex justify-between items-center bg-muted p-3 border-b">
              <h3 className="text-sm font-medium">Microsoft Ad #{index + 1}</h3>
              <div className="flex gap-2">
                {editingIndex === index ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSave(index, ads[index])}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4">
              <MicrosoftAdPreview ad={ad} domain={domain} />
              
              <MicrosoftAdEditor
                ad={ad}
                isEditing={editingIndex === index}
                onHeadlineChange={(headlineIndex, value) => 
                  handleHeadlineChange(index, headlineIndex, value)
                }
                onDescriptionChange={(descIndex, value) => 
                  handleDescriptionChange(index, descIndex, value)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Trigger Gallery */}
      <TriggerGallery
        open={showTriggerGallery}
        onOpenChange={setShowTriggerGallery}
        onSelectTrigger={handleSelectTrigger}
      />
    </div>
  );
};

export default MicrosoftAdsTab;
