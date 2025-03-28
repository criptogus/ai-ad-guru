
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCard from "./LinkedInAdCard";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import TriggerGallery from "@/components/mental-triggers/TriggerGallery";

interface LinkedInAdsListProps {
  ads: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage: boolean;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd: (index: number, updatedAd: MetaAd) => void;
  onDuplicate?: (index: number) => void;
  onDelete?: (index: number) => void;
  mindTrigger?: string;
  onMindTriggerChange?: (trigger: string) => void;
}

const LinkedInAdsList: React.FC<LinkedInAdsListProps> = ({
  ads,
  analysisResult,
  isGeneratingImage,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd,
  onDuplicate,
  onDelete,
  mindTrigger,
  onMindTriggerChange
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showTriggerGallery, setShowTriggerGallery] = useState(false);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number, updatedAd: MetaAd) => {
    onUpdateAd(index, updatedAd);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleGenerateImage = (ad: MetaAd, index: number) => {
    return onGenerateImage(ad, index);
  };

  const handleSelectTrigger = (trigger: string) => {
    if (onMindTriggerChange) {
      onMindTriggerChange(trigger);
    }
  };

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
          <Button size="sm" variant="outline" onClick={() => setShowTriggerGallery(true)}>
            {mindTrigger ? "Change Trigger" : "Add Trigger"}
          </Button>
        </div>
      )}
      
      {/* LinkedIn Ads List */}
      {ads.map((ad, index) => (
        <LinkedInAdCard
          key={`linkedin-ad-${index}`}
          ad={ad}
          index={index}
          analysisResult={analysisResult}
          isGeneratingImage={isGeneratingImage && loadingImageIndex === index}
          isEditing={editingIndex === index}
          onGenerateImage={() => handleGenerateImage(ad, index)}
          onUpdateAd={(updatedAd) => onUpdateAd(index, updatedAd)}
          onEdit={() => handleEdit(index)}
          onSave={(updatedAd) => handleSave(index, updatedAd)}
          onCancel={handleCancel}
          onCopy={() => onDuplicate && onDuplicate(index)}
        />
      ))}

      {/* Add New Ad Button */}
      {onDuplicate && ads.length > 0 && (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => onDuplicate(ads.length - 1)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New LinkedIn Ad Variation
        </Button>
      )}

      {/* Placeholder when no ads */}
      {ads.length === 0 && !isGeneratingImage && (
        <div className="border border-dashed rounded-md p-8 text-center">
          <p className="text-muted-foreground">No LinkedIn ads generated yet</p>
        </div>
      )}

      {/* Loading state */}
      {isGeneratingImage && loadingImageIndex === null && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Generating LinkedIn ads...</span>
        </div>
      )}

      {/* Mind Trigger Gallery */}
      <TriggerGallery
        open={showTriggerGallery}
        onOpenChange={setShowTriggerGallery}
        onSelectTrigger={handleSelectTrigger}
      />
    </div>
  );
};

export default LinkedInAdsList;
