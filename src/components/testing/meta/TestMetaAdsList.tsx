
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { MetaAdCard } from "@/components/campaign/ad-preview/meta/card";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface TestMetaAdsListProps {
  metaAds: MetaAd[];
  defaultAnalysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateAd: (index: number, updatedAd: MetaAd) => void;
}

const TestMetaAdsList: React.FC<TestMetaAdsListProps> = ({
  metaAds,
  defaultAnalysisResult,
  loadingImageIndex,
  handleGenerateImage,
  handleUpdateAd
}) => {
  // Create local state to track which ad is being edited
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    setEditingAdIndex(index);
  };

  const handleSave = (index: number, updatedAd: MetaAd) => {
    handleUpdateAd(index, updatedAd);
    setEditingAdIndex(null);
  };

  const handleCancel = () => {
    setEditingAdIndex(null);
  };

  const handleCopy = (ad: MetaAd) => {
    const text = `Headline: ${ad.headline}\n\nPrimary Text: ${ad.primaryText}\n\nDescription: ${ad.description}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Test Ads ({metaAds.length})</h2>
      
      {metaAds.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p>No test ads created yet. Add one above.</p>
        </div>
      ) : (
        metaAds.map((ad, index) => (
          <MetaAdCard 
            key={index} 
            ad={ad} 
            index={index} 
            analysisResult={defaultAnalysisResult}
            isEditing={editingAdIndex === index}
            isGeneratingImage={loadingImageIndex === index}
            loadingImageIndex={loadingImageIndex}
            onEdit={() => handleEdit(index)}
            onSave={(updatedAd) => handleSave(index, updatedAd)}
            onCancel={handleCancel}
            onCopy={() => handleCopy(ad)}
            onGenerateImage={() => handleGenerateImage(ad, index)}
          />
        ))
      )}
    </div>
  );
};

export default TestMetaAdsList;
