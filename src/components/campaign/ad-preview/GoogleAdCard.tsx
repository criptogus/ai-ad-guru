
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">Google Ad Variation {index + 1}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
            >
              <Check size={16} className="mr-1" /> Save
            </Button>
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
      
      {/* Google Ad Preview */}
      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <div className="text-xs text-gray-500 mb-1">www.{analysisResult.companyName.toLowerCase().replace(/\s+/g, "-")}.com</div>
        <div className="text-blue-800 font-medium text-xl leading-tight">
          {displayAd.headlines.map((headline, i) => (
            <span key={i}>
              {headline}
              {i < displayAd.headlines.length - 1 && <span className="text-gray-400"> | </span>}
            </span>
          ))}
        </div>
        <div className="text-gray-600 text-sm mt-1">
          {displayAd.descriptions.map((desc, i) => (
            <div key={i}>{desc}</div>
          ))}
        </div>
      </div>
      
      {/* Ad Details - Editable when in edit mode */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Headlines:</span>
          <ul className="list-inside pl-2 space-y-1 mt-1">
            {displayAd.headlines.map((headline, i) => (
              <li key={i} className="flex items-center">
                {isEditing ? (
                  <Input 
                    value={headline}
                    onChange={(e) => handleHeadlineChange(e.target.value, i)}
                    className="text-sm h-8"
                  />
                ) : (
                  <span className="ml-2">{headline}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="font-medium">Descriptions:</span>
          <ul className="list-inside pl-2 space-y-1 mt-1">
            {displayAd.descriptions.map((desc, i) => (
              <li key={i} className="flex items-center">
                {isEditing ? (
                  <Input 
                    value={desc}
                    onChange={(e) => handleDescriptionChange(e.target.value, i)}
                    className="text-sm h-8"
                  />
                ) : (
                  <span className="ml-2">{desc}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleAdCard;
