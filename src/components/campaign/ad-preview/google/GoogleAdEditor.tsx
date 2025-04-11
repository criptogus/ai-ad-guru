
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
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-md font-medium mb-4">Ad Preview</h3>
        <div className="flex justify-center">
          <GoogleAdPreview ad={editedAd} domain={domain} />
        </div>
      </div>
      
      {/* Final URL field */}
      <div>
        <Label htmlFor="finalUrl">Final URL</Label>
        <Input
          id="finalUrl"
          value={editedAd.finalUrl || ""}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/landing-page"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          The full URL where people will go when they click your ad
        </p>
      </div>
      
      {/* Editor Section below */}
      <div className="border rounded-lg p-4">
        <h3 className="text-md font-medium mb-4">Ad Details</h3>
        
        {/* Headlines Section */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium">Headlines</h4>
          {(editedAd.headlines || []).map((headline, index) => (
            <div key={`headline-${index}`}>
              <Label htmlFor={`headline-${index}`} className="text-xs font-normal text-gray-500 mb-1">
                Headline {index + 1} ({headline?.length || 0}/30 characters)
              </Label>
              <Input
                id={`headline-${index}`}
                value={headline || ""}
                onChange={(e) => handleHeadlineChange(index, e.target.value)}
                maxLength={30}
                className="mt-1"
              />
            </div>
          ))}
        </div>
        
        {/* Descriptions Section */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium">Descriptions</h4>
          {(editedAd.descriptions || []).map((description, index) => (
            <div key={`description-${index}`}>
              <Label htmlFor={`description-${index}`} className="text-xs font-normal text-gray-500 mb-1">
                Description {index + 1} ({description?.length || 0}/90 characters)
              </Label>
              <Textarea
                id={`description-${index}`}
                value={description || ""}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                maxLength={90}
                className="mt-1"
                rows={2}
              />
            </div>
          ))}
        </div>
        
        {/* Path Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">URL Path</h4>
          <Label htmlFor="path" className="text-xs font-normal text-gray-500 mb-1">
            Path ({editedAd.path1?.length || 0}/15 characters)
          </Label>
          <Input
            id="path"
            value={editedAd.path1 || ""} 
            onChange={(e) => handlePathChange(e.target.value)}
            maxLength={15}
            className="mt-1"
          />
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          <p>Google Ad Character Limits:</p>
          <ul className="list-disc list-inside">
            <li>Headlines: 30 characters each</li>
            <li>Descriptions: 90 characters each</li>
            <li>URL Path: 15 characters</li>
          </ul>
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
