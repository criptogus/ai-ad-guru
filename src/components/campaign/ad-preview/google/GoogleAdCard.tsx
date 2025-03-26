
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "./GoogleAdPreview";
import GoogleAdCardHeader from "./GoogleAdCardHeader";
import GoogleAdDetails from "./GoogleAdDetails";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  domain: string;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ 
  ad, 
  index, 
  domain,
  analysisResult,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
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
            domain={domain} 
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
