
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { GoogleAd } from "@/hooks/adGeneration";
import TextAdTemplateGallery from "../text/TextAdTemplateGallery";

interface MicrosoftAdDetailsProps {
  ad: GoogleAd;
  isEditing: boolean;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

const MicrosoftAdDetails: React.FC<MicrosoftAdDetailsProps> = ({
  ad,
  isEditing,
  onUpdate
}) => {
  const [headline1, setHeadline1] = useState(ad.headline1 || "");
  const [headline2, setHeadline2] = useState(ad.headline2 || "");
  const [headline3, setHeadline3] = useState(ad.headline3 || "");
  const [description1, setDescription1] = useState(ad.description1 || "");
  const [description2, setDescription2] = useState(ad.description2 || "");
  const [path1, setPath1] = useState(ad.path1 || "");
  const [path2, setPath2] = useState(ad.path2 || "");
  const [showTemplates, setShowTemplates] = useState(false);

  // Update local state when ad prop changes
  useEffect(() => {
    setHeadline1(ad.headline1 || "");
    setHeadline2(ad.headline2 || "");
    setHeadline3(ad.headline3 || "");
    setDescription1(ad.description1 || "");
    setDescription2(ad.description2 || "");
    setPath1(ad.path1 || "");
    setPath2(ad.path2 || "");
  }, [ad]);

  // Handle saving the updated ad
  const handleSave = () => {
    if (!onUpdate) return;

    const updatedAd: GoogleAd = {
      ...ad,
      headline1,
      headline2,
      headline3,
      description1,
      description2,
      path1,
      path2,
      headlines: [headline1, headline2, headline3],
      descriptions: [description1, description2],
    };

    onUpdate(updatedAd);
  };

  // Handle template selection
  const handleSelectTemplate = (template: any) => {
    setHeadline1(template.headline1 || "");
    setHeadline2(template.headline2 || "");
    setHeadline3(template.headline3 || "");
    setDescription1(template.description1 || "");
    setDescription2(template.description2 || "");
    setShowTemplates(false);

    if (onUpdate) {
      const updatedAd: GoogleAd = {
        ...ad,
        headline1: template.headline1 || "",
        headline2: template.headline2 || "",
        headline3: template.headline3 || "",
        description1: template.description1 || "",
        description2: template.description2 || "",
        headlines: [template.headline1, template.headline2, template.headline3].filter(Boolean),
        descriptions: [template.description1, template.description2].filter(Boolean),
        path1,
        path2
      };
      
      onUpdate(updatedAd);
    }
  };

  // Read-only view
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Headlines</h3>
          <div className="space-y-2">
            <div className="text-sm">1. {headline1}</div>
            <div className="text-sm">2. {headline2}</div>
            <div className="text-sm">3. {headline3}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Descriptions</h3>
          <div className="space-y-2">
            <div className="text-sm">1. {description1}</div>
            <div className="text-sm">2. {description2}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Paths</h3>
          <div className="text-sm">
            {path1}{path2 ? `/${path2}` : ""}
          </div>
        </div>
      </div>
    );
  }

  // Editing view
  return (
    <div className="space-y-4">
      {showTemplates ? (
        <div className="mb-4">
          <TextAdTemplateGallery
            initialHeadline1={headline1}
            initialHeadline2={headline2}
            initialHeadline3={headline3}
            initialDescription1={description1}
            initialDescription2={description2}
            platform="microsoft"
            onSelectTemplate={handleSelectTemplate}
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => setShowTemplates(false)}
          >
            Hide Templates
          </Button>
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          onClick={() => setShowTemplates(true)}
        >
          Browse Ad Templates
        </Button>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="headline1">Headline 1 (30 chars max)</Label>
          <div className="flex items-center mt-1 gap-1">
            <Input
              id="headline1"
              value={headline1}
              onChange={(e) => setHeadline1(e.target.value)}
              maxLength={30}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground w-10 text-right">
              {headline1.length}/30
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="headline2">Headline 2 (30 chars max)</Label>
          <div className="flex items-center mt-1 gap-1">
            <Input
              id="headline2"
              value={headline2}
              onChange={(e) => setHeadline2(e.target.value)}
              maxLength={30}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground w-10 text-right">
              {headline2.length}/30
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="headline3">Headline 3 (30 chars max)</Label>
          <div className="flex items-center mt-1 gap-1">
            <Input
              id="headline3"
              value={headline3}
              onChange={(e) => setHeadline3(e.target.value)}
              maxLength={30}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground w-10 text-right">
              {headline3.length}/30
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description1">Description 1 (90 chars max)</Label>
          <div className="flex items-center mt-1 gap-1">
            <Textarea
              id="description1"
              value={description1}
              onChange={(e) => setDescription1(e.target.value)}
              maxLength={90}
              rows={2}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground w-10 text-right">
              {description1.length}/90
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description2">Description 2 (90 chars max)</Label>
          <div className="flex items-center mt-1 gap-1">
            <Textarea
              id="description2"
              value={description2}
              onChange={(e) => setDescription2(e.target.value)}
              maxLength={90}
              rows={2}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground w-10 text-right">
              {description2.length}/90
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="path1">Path 1 (Optional)</Label>
            <Input
              id="path1"
              value={path1}
              onChange={(e) => setPath1(e.target.value)}
              placeholder="e.g., services"
              maxLength={15}
            />
          </div>
          <div>
            <Label htmlFor="path2">Path 2 (Optional)</Label>
            <Input
              id="path2"
              value={path2}
              onChange={(e) => setPath2(e.target.value)}
              placeholder="e.g., premium"
              maxLength={15}
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        size="sm" 
        className="w-full"
      >
        <Check className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default MicrosoftAdDetails;
