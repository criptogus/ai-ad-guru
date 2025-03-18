
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (index: number, updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult,
  onUpdate 
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<GoogleAd>(ad);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard",
      duration: 2000,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(index, editedAd);
    }
    toast({
      title: "Ad Updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAd(ad);
  };

  const handleHeadlineChange = (value: string, headlineIndex: number) => {
    const updatedHeadlines = [...editedAd.headlines];
    updatedHeadlines[headlineIndex] = value;
    setEditedAd({ ...editedAd, headlines: updatedHeadlines });
  };

  const handleDescriptionChange = (value: string, descIndex: number) => {
    const updatedDescriptions = [...editedAd.descriptions];
    updatedDescriptions[descIndex] = value;
    setEditedAd({ ...editedAd, descriptions: updatedDescriptions });
  };

  const displayAd = isEditing ? editedAd : ad;
  const domain = analysisResult.websiteUrl 
    ? new URL(analysisResult.websiteUrl).hostname 
    : `www.${analysisResult.companyName.toLowerCase().replace(/\s+/g, "")}.com`;

  // Helper to limit text with indicator for search preview
  const truncateForPreview = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800">Google Ad Variation {index + 1}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
              >
                <Check size={16} className="mr-1" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(`${displayAd.headlines.join(" | ")}\n\n${displayAd.descriptions.join("\n")}`)}
              >
                <Copy size={16} className="mr-1" /> Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
              >
                <Edit size={16} className="mr-1" /> Edit
              </Button>
            </>
          )}
        </div>
      </div>
      
      {index === 0 && (
        <Alert className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This ad will be automatically optimized based on campaign performance.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Google Ad Preview - Accurate Google Ads format */}
      <div className="border rounded-md overflow-hidden mb-4">
        <div className="p-4">
          {/* Ad Badge */}
          <div className="flex items-center mb-1">
            <span className="text-[11px] px-[4px] py-[1px] mr-1 rounded bg-white text-[#1a73e8] border border-[#1a73e8]">Ad</span>
            <span className="text-xs text-gray-500">{domain}</span>
          </div>
          
          {/* URL Path */}
          <div className="text-[#202124] text-sm mb-1">
            {domain}
          </div>
          
          {/* Headline - With pipes between each headline */}
          <div className="text-[#1a0dab] font-medium text-xl leading-tight cursor-pointer hover:underline mb-1">
            {displayAd.headlines.map((headline, i) => (
              <span key={i}>
                {headline}
                {i < displayAd.headlines.length - 1 && <span className="text-gray-400"> | </span>}
              </span>
            ))}
          </div>
          
          {/* Descriptions */}
          <div className="text-[#4d5156] text-sm mt-1">
            {displayAd.descriptions.map((desc, i) => (
              <div key={i}>{desc}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Ad Details - Editable when in edit mode */}
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-gray-700">Headlines:</span>
          <div className="space-y-2 mt-1">
            {displayAd.headlines.map((headline, i) => (
              <div key={i} className="flex flex-col">
                {isEditing ? (
                  <div>
                    <Input 
                      value={headline}
                      onChange={(e) => handleHeadlineChange(e.target.value, i)}
                      className="text-sm h-8"
                      maxLength={30}
                      placeholder={`Headline ${i+1}`}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {headline.length}/30 characters
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="ml-2 text-sm">{i+1}. {headline}</span>
                    <span className="ml-2 text-xs text-gray-500">{headline.length}/30 characters</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Descriptions:</span>
          <div className="space-y-2 mt-1">
            {displayAd.descriptions.map((desc, i) => (
              <div key={i} className="flex flex-col">
                {isEditing ? (
                  <div>
                    <Textarea 
                      value={desc}
                      onChange={(e) => handleDescriptionChange(e.target.value, i)}
                      className="text-sm min-h-[60px]"
                      maxLength={90}
                      placeholder={`Description ${i+1}`}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {desc.length}/90 characters
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="ml-2 text-sm">{i+1}. {desc}</span>
                    <span className="ml-2 text-xs text-gray-500">{desc.length}/90 characters</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAdCard;
