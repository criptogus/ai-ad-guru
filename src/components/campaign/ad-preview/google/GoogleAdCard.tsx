
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoogleAd } from "@/hooks/adGeneration";
import { TriggerButtonInline } from "../TriggerButtonInline";
import GoogleAdPreview from "./GoogleAdPreview";

interface GoogleAdCardProps {
  index: number;
  ad: GoogleAd;
  domain: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedAd: GoogleAd) => void;
  onCancel: () => void;
  onCopy: () => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({
  index,
  ad,
  domain,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy,
}) => {
  const [editedAd, setEditedAd] = useState<GoogleAd>(ad);

  useEffect(() => {
    setEditedAd(ad);
  }, [ad]);

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...editedAd.headlines];
    newHeadlines[index] = value;
    setEditedAd({ ...editedAd, headlines: newHeadlines });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...editedAd.descriptions];
    newDescriptions[index] = value;
    setEditedAd({ ...editedAd, descriptions: newDescriptions });
  };

  const handleSelectTrigger = (trigger: string) => {
    // Add a part of the trigger as a headline or description depending on length
    if (isEditing) {
      // If trigger is short enough, add as a headline
      if (trigger.length <= 30) {
        const newHeadlines = [...editedAd.headlines];
        if (newHeadlines.length < 3) {
          newHeadlines.push(trigger);
        } else {
          // Replace the last headline
          newHeadlines[2] = trigger;
        }
        setEditedAd({ ...editedAd, headlines: newHeadlines });
      } else {
        // Add as a description
        const newDescriptions = [...editedAd.descriptions];
        if (newDescriptions.length < 2) {
          newDescriptions.push(trigger);
        } else {
          // Replace the last description
          newDescriptions[1] = trigger;
        }
        setEditedAd({ ...editedAd, descriptions: newDescriptions });
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex justify-between items-center bg-muted p-3 border-b">
          <h3 className="text-sm font-medium">Google Ad #{index + 1}</h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onSave(editedAd)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ad Content */}
        <div className="p-4 space-y-4">
          {/* Google Ad Preview */}
          <div className="border rounded-md p-4 bg-white">
            <GoogleAdPreview ad={editedAd} domain={domain} />
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Headlines (30 chars max each)</p>
                  <TriggerButtonInline onSelectTrigger={handleSelectTrigger} />
                </div>
                <div className="space-y-2">
                  {editedAd.headlines.map((headline, i) => (
                    <div key={`headline-${i}`} className="flex items-center">
                      <Input 
                        value={headline} 
                        onChange={(e) => handleHeadlineChange(i, e.target.value)}
                        placeholder={`Headline ${i + 1}`}
                        maxLength={30}
                        className="flex-1"
                      />
                      <div className="text-xs text-muted-foreground ml-2 w-10 text-right">
                        {headline.length}/30
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Descriptions (90 chars max each)</p>
                <div className="space-y-2">
                  {editedAd.descriptions.map((description, i) => (
                    <div key={`description-${i}`} className="flex items-start">
                      <Textarea 
                        value={description} 
                        onChange={(e) => handleDescriptionChange(i, e.target.value)}
                        placeholder={`Description ${i + 1}`}
                        maxLength={90}
                        rows={2}
                        className="flex-1"
                      />
                      <div className="text-xs text-muted-foreground ml-2 w-10 text-right">
                        {description.length}/90
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Headlines</p>
                <div className="space-y-1">
                  {editedAd.headlines.map((headline, i) => (
                    <div key={`headline-${i}`} className="text-sm border p-2 rounded-md bg-muted/20">
                      {headline}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Descriptions</p>
                <div className="space-y-1">
                  {editedAd.descriptions.map((description, i) => (
                    <div key={`description-${i}`} className="text-sm border p-2 rounded-md bg-muted/20">
                      {description}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;
