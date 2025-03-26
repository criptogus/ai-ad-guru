import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoogleAd } from "@/hooks/adGeneration";
import MentalTriggersSection from "../MentalTriggersSection";
import TriggerButtonInline from "../TriggerButtonInline";

interface GoogleAdEditorProps {
  ad: GoogleAd;
  onChange: (updatedAd: GoogleAd) => void;
}

const GoogleAdEditor: React.FC<GoogleAdEditorProps> = ({ ad, onChange }) => {
  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...ad.headlines];
    newHeadlines[index] = value;
    onChange({ ...ad, headlines: newHeadlines });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...ad.descriptions];
    newDescriptions[index] = value;
    onChange({ ...ad, descriptions: newDescriptions });
  };

  const handleInsertTrigger = (triggerText: string) => {
    handleHeadlineChange(0, triggerText);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Headlines (30 chars max)</h3>
              </div>
              
              {ad.headlines.map((headline, index) => (
                <div key={`headline-${index}`} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`headline-${index}`}>Headline {index + 1}</Label>
                    {index === 0 && (
                      <TriggerButtonInline onInsert={handleInsertTrigger} />
                    )}
                  </div>
                  <Input
                    id={`headline-${index}`}
                    value={headline}
                    onChange={(e) => handleHeadlineChange(index, e.target.value)}
                    maxLength={30}
                    className="h-9"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {headline.length}/30 characters
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Descriptions (90 chars max)</h3>
              {ad.descriptions.map((description, index) => (
                <div key={`description-${index}`} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`description-${index}`}>Description {index + 1}</Label>
                    <TriggerButtonInline onInsert={(text) => handleDescriptionChange(index, text)} />
                  </div>
                  <Textarea
                    id={`description-${index}`}
                    value={description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    maxLength={90}
                    rows={2}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {description.length}/90 characters
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <MentalTriggersSection onSelectTrigger={handleInsertTrigger} />
    </div>
  );
};

export default GoogleAdEditor;
