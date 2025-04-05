
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Edit, Check, X, Copy } from "lucide-react";
import MicrosoftAdDetails from "./MicrosoftAdDetails";
import { TriggerButton } from "@/components/mental-triggers/TriggerButton";

interface MicrosoftAdEditorProps {
  ad: GoogleAd;
  index: number;
  onUpdateAd: (index: number, updatedAd: GoogleAd) => void;
}

const MicrosoftAdEditor: React.FC<MicrosoftAdEditorProps> = ({
  ad,
  index,
  onUpdateAd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<GoogleAd>(ad);

  const handleStartEditing = () => {
    // Ensure headlines/descriptions arrays by creating a new object
    const updatedAd = { 
      ...ad,
      headlines: ad.headlines || [
        ad.headline1 || '', 
        ad.headline2 || '', 
        ad.headline3 || ''
      ],
      descriptions: ad.descriptions || [
        ad.description1 || '',
        ad.description2 || ''
      ]
    };
    
    setEditedAd(updatedAd);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onUpdateAd(index, editedAd);
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setEditedAd(ad);
    setIsEditing(false);
  };

  const handleCopyContent = () => {
    // Create fallback for copying if headlines/descriptions arrays don't exist
    let headlinesText;
    if (Array.isArray(ad.headlines)) {
      headlinesText = ad.headlines.join('\n');
    } else {
      headlinesText = `${ad.headline1}\n${ad.headline2}\n${ad.headline3}`;
    }
      
    let descriptionsText;
    if (Array.isArray(ad.descriptions)) {
      descriptionsText = ad.descriptions.join('\n');
    } else {
      descriptionsText = `${ad.description1}\n${ad.description2}`;
    }
      
    const content = `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`;
    navigator.clipboard.writeText(content);
  };

  const handleUpdateAd = (updatedAd: GoogleAd) => {
    setEditedAd(updatedAd);
  };

  const handleInsertTrigger = (triggerText: string) => {
    // Create a new object with headlines and descriptions arrays if they don't exist
    const updatedAd = { ...editedAd };
    
    if (!updatedAd.headlines) {
      updatedAd.headlines = [
        updatedAd.headline1 || '',
        updatedAd.headline2 || '',
        updatedAd.headline3 || ''
      ];
    }
    
    if (!updatedAd.descriptions) {
      updatedAd.descriptions = [
        updatedAd.description1 || '',
        updatedAd.description2 || ''
      ];
    }
    
    // Choose where to insert the trigger (e.g., first headline)
    const updatedHeadlines = [...(updatedAd.headlines || [])];
    
    if (updatedHeadlines[0].length + triggerText.length <= 30) {
      // If it fits in the first headline
      updatedHeadlines[0] = triggerText;
      updatedAd.headline1 = triggerText;
    } else if (updatedHeadlines[1].length + triggerText.length <= 30) {
      // If it fits in the second headline
      updatedHeadlines[1] = triggerText;
      updatedAd.headline2 = triggerText;
    } else if (updatedHeadlines[2].length + triggerText.length <= 30) {
      // If it fits in the third headline
      updatedHeadlines[2] = triggerText;
      updatedAd.headline3 = triggerText;
    } else {
      // If it doesn't fit in any headline, try to add to description
      const updatedDescriptions = [...(updatedAd.descriptions || [])];
      if (updatedDescriptions[0].length + triggerText.length <= 90) {
        updatedDescriptions[0] = triggerText;
        updatedAd.description1 = triggerText;
        updatedAd.descriptions = updatedDescriptions;
        setEditedAd(updatedAd);
        return;
      }
    }
    
    updatedAd.headlines = updatedHeadlines;
    setEditedAd(updatedAd);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Ad Content</h3>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEditing}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveChanges}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyContent}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEditing}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mb-2">
          <TriggerButton
            onSelectTrigger={handleInsertTrigger}
            buttonText="Add Mind Trigger"
            tooltip="Insert psychological triggers to improve ad performance"
            variant="outline"
            size="sm"
          />
        </div>
      )}

      <MicrosoftAdDetails
        ad={isEditing ? editedAd : ad}
        onUpdate={handleUpdateAd}
        isEditing={isEditing}
      />
    </div>
  );
};

export default MicrosoftAdEditor;
