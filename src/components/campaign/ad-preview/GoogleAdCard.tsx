
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "./google/GoogleAdPreview";
import GoogleAdCardHeader from "./google/GoogleAdCardHeader";
import GoogleAdDetails from "./google/GoogleAdDetails";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Extract domain from website URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);
  const handleCopy = () => {
    const textToCopy = `Headlines:\n${ad.headlines.join('\n')}\n\nDescriptions:\n${ad.descriptions.join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <Card className="overflow-hidden">
      <GoogleAdCardHeader 
        index={index} 
        ad={ad}
        isEditing={isEditing}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
        <div>
          <GoogleAdPreview 
            ad={ad} 
            domain={getDomain(analysisResult.websiteUrl)} 
          />
        </div>
        <div>
          <GoogleAdDetails 
            ad={ad}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;
