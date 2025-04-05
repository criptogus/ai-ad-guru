import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { Button } from "@/components/ui/button";
import { Edit, Check, X, Copy } from "lucide-react";
import GoogleAdDetails from "./GoogleAdDetails";
import { TriggerButton } from "@/components/mental-triggers/TriggerButton";
import { normalizeGoogleAd } from "@/lib/utils";

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
  const normalizedAd = normalizeGoogleAd(ad);
  const [editedAd, setEditedAd] = useState<GoogleAd>(normalizedAd);

  const handleStartEditing = () => {
    setEditedAd(normalizeGoogleAd(ad));
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onUpdateAd(index, normalizeGoogleAd(editedAd));
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setEditedAd(normalizeGoogleAd(ad));
    setIsEditing(false);
  };

  const handleCopyContent = () => {
    const headlinesText = normalizedAd.headlines.join('\n');
    const descriptionsText = normalizedAd.descriptions.join('\n');
    const content = `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`;
    navigator.clipboard.writeText(content);
  };

  const handleUpdateAd = (updatedAd: GoogleAd) => {
    setEditedAd(normalizeGoogleAd(updatedAd));
  };

  const handleInsertTrigger = (triggerText: string) => {
    const updatedAd = normalizeGoogleAd(editedAd);
    
    if (updatedAd.headlines[0].length + triggerText.length <= 30) {
      updatedAd.headlines[0] = triggerText;
      updatedAd.headline1 = triggerText;
    } else if (updatedAd.headlines[1].length + triggerText.length <= 30) {
      updatedAd.headlines[1] = triggerText;
      updatedAd.headline2 = triggerText;
    } else if (updatedAd.headlines[2].length + triggerText.length <= 30) {
      updatedAd.headlines[2] = triggerText;
      updatedAd.headline3 = triggerText;
    } else {
      if (updatedAd.descriptions[0].length + triggerText.length <= 90) {
        updatedAd.descriptions[0] = triggerText;
        updatedAd.description1 = triggerText;
        setEditedAd(updatedAd);
        return;
      }
    }
    
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

      <GoogleAdDetails
        ad={isEditing ? editedAd : ad}
        onUpdate={handleUpdateAd}
        isEditing={isEditing}
      />
    </div>
  );
};

export default GoogleAdEditor;
