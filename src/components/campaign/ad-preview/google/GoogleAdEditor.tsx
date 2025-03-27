
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Edit, Check, X, Copy } from "lucide-react";
import GoogleAdDetails from "./GoogleAdDetails";
import { TriggerButton } from "@/components/mental-triggers/TriggerButton";

interface GoogleAdEditorProps {
  ad: GoogleAd;
  index: number;
  onUpdateAd: (index: number, updatedAd: GoogleAd) => void;
}

const GoogleAdEditor: React.FC<GoogleAdEditorProps> = ({
  ad,
  index,
  onUpdateAd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<GoogleAd>(ad);

  const handleStartEditing = () => {
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
    const content = `Headlines:\n${ad.headlines.join('\n')}\n\nDescriptions:\n${ad.descriptions.join('\n')}`;
    navigator.clipboard.writeText(content);
  };

  const handleUpdateAd = (updatedAd: GoogleAd) => {
    setEditedAd(updatedAd);
  };

  const handleInsertTrigger = (triggerText: string) => {
    // Choose where to insert the trigger (e.g., first headline)
    const updatedHeadlines = [...editedAd.headlines];
    if (updatedHeadlines[0].length + triggerText.length <= 30) {
      // If it fits in the first headline
      updatedHeadlines[0] = triggerText;
    } else if (updatedHeadlines[1].length + triggerText.length <= 30) {
      // If it fits in the second headline
      updatedHeadlines[1] = triggerText;
    } else if (updatedHeadlines[2].length + triggerText.length <= 30) {
      // If it fits in the third headline
      updatedHeadlines[2] = triggerText;
    } else {
      // If it doesn't fit in any headline, try to add to description
      const updatedDescriptions = [...editedAd.descriptions];
      if (updatedDescriptions[0].length + triggerText.length <= 90) {
        updatedDescriptions[0] = triggerText;
        setEditedAd({
          ...editedAd,
          descriptions: updatedDescriptions
        });
        return;
      }
    }
    
    setEditedAd({
      ...editedAd,
      headlines: updatedHeadlines
    });
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

      <GoogleAdDetails
        ad={isEditing ? editedAd : ad}
        onUpdate={handleUpdateAd}
        isEditing={isEditing}
      />
    </div>
  );
};

export default GoogleAdEditor;
