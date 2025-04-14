
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GoogleAd } from '@/hooks/adGeneration';
import GoogleAdPreview from './GoogleAdPreview';

interface GoogleAdEditorProps {
  ad: GoogleAd;
  domain: string;
  onSave: (updatedAd: GoogleAd) => void;
  onCancel: () => void;
}

const GoogleAdEditor: React.FC<GoogleAdEditorProps> = ({
  ad,
  domain,
  onSave,
  onCancel
}) => {
  const [editedAd, setEditedAd] = useState<GoogleAd>({...ad});
  
  const handleHeadlineChange = (index: number, value: string) => {
    const updatedHeadlines = [...(editedAd.headlines || [])];
    updatedHeadlines[index] = value;
    setEditedAd({
      ...editedAd,
      headlines: updatedHeadlines
    });
  };
  
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...(editedAd.descriptions || [])];
    updatedDescriptions[index] = value;
    setEditedAd({
      ...editedAd,
      descriptions: updatedDescriptions
    });
  };
  
  const handlePathChange = (value: string) => {
    setEditedAd({
      ...editedAd,
      path1: value
    });
  };
  
  const handleUrlChange = (value: string) => {
    setEditedAd({
      ...editedAd,
      finalUrl: value
    });
  };
  
  const handleSaveClick = () => {
    onSave(editedAd);
  };

  return (
    <div className="space-y-6">
      {/* Preview Section at the top */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <h3 className="text-sm font-medium mb-4 text-muted-foreground">Ad Preview</h3>
        <div className="flex justify-center">
          <GoogleAdPreview ad={editedAd} domain={domain} />
        </div>
      </div>
      
      {/* Editor Section below */}
      <div className="border rounded-lg p-5">
        <h3 className="text-sm font-medium mb-4 text-muted-foreground">Edit Ad Content</h3>
        
        {/* Final URL field */}
        <div className="mb-6">
          <Label htmlFor="finalUrl" className="text-sm font-medium">Final URL</Label>
          <Input
            id="finalUrl"
            value={editedAd.finalUrl || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/landing-page"
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The full URL where people will go when they click your ad
          </p>
        </div>
        
        {/* Headlines Section */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium">Headlines</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {(editedAd.headlines || []).map((headline, index) => (
              <div key={`headline-${index}`} className="space-y-1.5">
                <Label htmlFor={`headline-${index}`} className="text-xs text-muted-foreground">
                  Headline {index + 1} ({headline?.length || 0}/30)
                </Label>
                <Input
                  id={`headline-${index}`}
                  value={headline || ""}
                  onChange={(e) => handleHeadlineChange(index, e.target.value)}
                  maxLength={30}
                  className="h-9"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Write clear, compelling headlines. Avoid excessive separators (|).
          </p>
        </div>
        
        {/* Descriptions Section */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium">Descriptions</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {(editedAd.descriptions || []).map((description, index) => (
              <div key={`description-${index}`} className="space-y-1.5">
                <Label htmlFor={`description-${index}`} className="text-xs text-muted-foreground">
                  Description {index + 1} ({description?.length || 0}/90)
                </Label>
                <Textarea
                  id={`description-${index}`}
                  value={description || ""}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  maxLength={90}
                  className="min-h-[80px]"
                  rows={3}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Use clear, concise descriptions with a strong call to action.
          </p>
        </div>
        
        {/* Path Section */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium">URL Path</h4>
          <Label htmlFor="path" className="text-xs text-muted-foreground">
            Path ({editedAd.path1?.length || 0}/15)
          </Label>
          <Input
            id="path"
            value={editedAd.path1 || ""} 
            onChange={(e) => handlePathChange(e.target.value)}
            maxLength={15}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            A keyword-rich path to display in your ad URL (example: services/premium)
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveClick}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default GoogleAdEditor;
