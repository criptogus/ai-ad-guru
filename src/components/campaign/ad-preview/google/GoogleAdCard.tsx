
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Save, X } from "lucide-react";
import GoogleAdPreview from "./GoogleAdPreview";
import GoogleAdDetails from "./GoogleAdDetails";
import GoogleAdEditor from "./GoogleAdEditor";
import { normalizeGoogleAd } from "@/lib/utils";
import { toast } from "sonner";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  domain: string;
  onUpdateAd: (updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({
  ad,
  index,
  domain,
  onUpdateAd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  // Always normalize the ad to ensure headlines and descriptions arrays exist
  const normalizedAd = normalizeGoogleAd(ad);
  const [editedAd, setEditedAd] = useState<GoogleAd>(normalizedAd);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Always normalize the ad before saving
    onUpdateAd(normalizeGoogleAd(editedAd));
    setIsEditing(false);
    toast.success("Ad updated successfully");
  };

  const handleCancel = () => {
    // Reset to the original normalized ad
    setEditedAd(normalizedAd);
    setIsEditing(false);
  };

  const handleCopy = () => {
    // Create fallback for copying if headlines/descriptions arrays don't exist
    const headlinesText = normalizedAd.headlines.join('\n');
    const descriptionsText = normalizedAd.descriptions.join('\n');
    const content = `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`;
    navigator.clipboard.writeText(content);
    toast.success("Ad content copied to clipboard");
  };

  const handleUpdateAd = (updatedAd: GoogleAd) => {
    setEditedAd(normalizeGoogleAd(updatedAd));
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
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
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
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ad Content */}
        {isEditing ? (
          <div className="p-4">
            <GoogleAdEditor
              ad={normalizeGoogleAd(editedAd)}
              domain={domain}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="flex flex-col p-4 gap-6">
            {/* Preview first */}
            <div className="bg-muted/30 p-4 rounded-lg border">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Ad Preview</h4>
              <div className="flex justify-center">
                <GoogleAdPreview ad={normalizedAd} domain={domain} />
              </div>
            </div>
            
            {/* Details below */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Ad Content</h4>
              <GoogleAdDetails 
                ad={normalizedAd}
                isEditing={false}
                onUpdateAd={handleUpdateAd}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;
