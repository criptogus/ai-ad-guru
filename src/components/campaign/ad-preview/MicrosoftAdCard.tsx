
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MicrosoftAdPreview from "./microsoft/MicrosoftAdPreview";
import MicrosoftAdCardHeader from "./microsoft/MicrosoftAdCardHeader";
import MicrosoftAdDetails from "./microsoft/MicrosoftAdDetails";

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

  return (
    <Card className="overflow-hidden">
      <MicrosoftAdCardHeader 
        adIndex={index} 
        ad={ad}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
        <div>
          <MicrosoftAdPreview 
            ad={ad} 
            domain={getDomain(analysisResult.websiteUrl)} 
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
