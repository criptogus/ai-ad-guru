
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleAd } from '@/hooks/adGeneration';
import GoogleAdDetails from './GoogleAdDetails';
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
      path1: value // Changed from path to path1
    });
  };
  
  const handleUrlChange = (value: string) => {
    setEditedAd({
      ...editedAd,
      finalUrl: value // This field needs to be added to GoogleAd type
    });
  };
  
  const handleSaveClick = () => {
    onSave(editedAd);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="finalUrl">Final URL</Label>
        <Input
          id="finalUrl"
          value={editedAd.finalUrl || ""} // This field needs to be added to GoogleAd type
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/landing-page"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          The full URL where people will go when they click your ad
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium mb-4">Ad Preview</h3>
          <GoogleAdPreview ad={editedAd} domain={domain} />
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-4">Ad Details</h3>
          <GoogleAdDetails
            ad={editedAd}
            isEditing={true}
            onHeadlineChange={handleHeadlineChange}
            onDescriptionChange={handleDescriptionChange}
            onPathChange={handlePathChange}
          />
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
