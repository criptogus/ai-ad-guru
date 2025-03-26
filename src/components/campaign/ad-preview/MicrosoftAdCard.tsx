
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MicrosoftAdPreview } from "@/components/campaign/ad-preview/microsoft";
import MicrosoftAdCardHeader from "./microsoft/MicrosoftAdCardHeader";
import MicrosoftAdDetails from "./microsoft/MicrosoftAdDetails";
import { getDomainFromUrl } from "@/lib/utils";

interface MicrosoftAdCardProps {
  ad: any;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (updatedAd: any) => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Extract domain from website URL
  const domain = getDomainFromUrl(analysisResult.websiteUrl || "example.com");

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);
  const handleCopy = () => {
    // Implement copy functionality
    const textToCopy = `Headlines: ${ad.headlines?.join(', ')}\nDescriptions: ${ad.descriptions?.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <Card className="overflow-hidden">
      <MicrosoftAdCardHeader 
        adIndex={index} 
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onCopy={handleCopy}
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
        <div>
          <MicrosoftAdPreview 
            ad={ad} 
            domain={domain} 
          />
        </div>
        <div>
          <MicrosoftAdDetails 
            ad={ad}
            isEditing={isEditing}
            onUpdate={onUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;
