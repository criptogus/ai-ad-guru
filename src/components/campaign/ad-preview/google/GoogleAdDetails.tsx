
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GoogleAd } from '@/hooks/adGeneration';
import { useFormContext } from 'react-hook-form';

interface GoogleAdDetailsProps {
  ad: GoogleAd;
  isEditing: boolean;
  onUpdateAd?: (updatedAd: GoogleAd) => void;
  onHeadlineChange?: (index: number, value: string) => void;
  onDescriptionChange?: (index: number, value: string) => void;
  onPathChange?: (value: string) => void;
}

const GoogleAdDetails: React.FC<GoogleAdDetailsProps> = ({
  ad,
  isEditing,
  onUpdateAd,
  onHeadlineChange,
  onDescriptionChange,
  onPathChange
}) => {
  // Get form context safely - it might be undefined if we're not in a form
  const formContext = useFormContext();
  
  // Create handler functions that will call the appropriate update function
  const handleHeadlineChange = (index: number, value: string) => {
    if (onHeadlineChange) {
      onHeadlineChange(index, value);
    } else if (onUpdateAd) {
      const updatedHeadlines = [...(ad.headlines || [])];
      updatedHeadlines[index] = value;
      onUpdateAd({
        ...ad,
        headlines: updatedHeadlines
      });
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    if (onDescriptionChange) {
      onDescriptionChange(index, value);
    } else if (onUpdateAd) {
      const updatedDescriptions = [...(ad.descriptions || [])];
      updatedDescriptions[index] = value;
      onUpdateAd({
        ...ad,
        descriptions: updatedDescriptions
      });
    }
  };

  const handlePathChange = (value: string) => {
    if (onPathChange) {
      onPathChange(value);
    } else if (onUpdateAd) {
      onUpdateAd({
        ...ad,
        path1: value // Changed from path to path1
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-medium mb-2">Headlines</h4>
        <div className="space-y-2">
          {isEditing ? (
            <>
              {(ad.headlines || []).map((headline, index) => (
                <div key={index}>
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
            </>
          ) : (
            <div className="grid gap-2">
              {(ad.headlines || []).map((headline, index) => (
                <div key={index} className="border p-2 rounded-md text-sm">
                  {headline || `Headline ${index + 1} (empty)`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Descriptions</h4>
        <div className="space-y-2">
          {isEditing ? (
            <>
              {(ad.descriptions || []).map((description, index) => (
                <div key={index}>
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
            </>
          ) : (
            <div className="grid gap-2">
              {(ad.descriptions || []).map((description, index) => (
                <div key={index} className="border p-2 rounded-md text-sm">
                  {description || `Description ${index + 1} (empty)`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">URL Path</h4>
        {isEditing ? (
          <div>
            <Label htmlFor="path" className="text-xs font-normal text-gray-500 mb-1">
              {/* Path length indicator with path1 instead of path */}
              Path ({ad.path1?.length || 0}/15 characters)
            </Label>
            <Input
              id="path"
              value={ad.path1 || ""} 
              onChange={(e) => handlePathChange(e.target.value)}
              maxLength={15}
              className="mt-1"
            />
          </div>
        ) : (
          <div className="border p-2 rounded-md text-sm">
            {ad.path1 || "No URL path provided"}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="text-xs text-gray-500 mt-4">
          <p>Google Ad Character Limits:</p>
          <ul className="list-disc list-inside">
            <li>Headlines: 30 characters each</li>
            <li>Descriptions: 90 characters each</li>
            <li>URL Path: 15 characters</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleAdDetails;
