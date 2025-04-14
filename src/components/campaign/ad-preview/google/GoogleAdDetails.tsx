
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
        path1: value
      });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-medium mb-3">Headlines</h4>
        <div className="space-y-3">
          {isEditing ? (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                {(ad.headlines || []).map((headline, index) => (
                  <div key={index} className="space-y-1.5">
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
                Write clear, compelling headlines. Each headline can have up to 30 characters.
              </p>
            </>
          ) : (
            <div className="grid gap-2">
              {(ad.headlines || []).map((headline, index) => (
                <div key={index} className="border p-2.5 rounded-md text-sm">
                  {headline || `Headline ${index + 1} (empty)`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Descriptions</h4>
        <div className="space-y-3">
          {isEditing ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {(ad.descriptions || []).map((description, index) => (
                  <div key={index} className="space-y-1.5">
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
                Use clear, concise descriptions with a strong call to action. Each description can have up to 90 characters.
              </p>
            </>
          ) : (
            <div className="grid gap-2">
              {(ad.descriptions || []).map((description, index) => (
                <div key={index} className="border p-2.5 rounded-md text-sm">
                  {description || `Description ${index + 1} (empty)`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">URL Path</h4>
        {isEditing ? (
          <div className="space-y-1.5">
            <Label htmlFor="path" className="text-xs text-muted-foreground">
              Path ({ad.path1?.length || 0}/15)
            </Label>
            <Input
              id="path"
              value={ad.path1 || ""} 
              onChange={(e) => handlePathChange(e.target.value)}
              maxLength={15}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              A keyword-rich path to display in your ad URL (example: services/premium)
            </p>
          </div>
        ) : (
          <div className="border p-2.5 rounded-md text-sm">
            {ad.path1 || "No URL path provided"}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-xs">
          <p className="font-medium mb-1">Ad Writing Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use clear and direct headlines for better click-through rates</li>
            <li>Include specific benefits or unique selling points</li>
            <li>Add a strong call-to-action in your descriptions</li>
            <li>Test different variations to see what performs best</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleAdDetails;
