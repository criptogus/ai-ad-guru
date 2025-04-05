
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export interface MicrosoftAdEditorProps {
  ad: GoogleAd;
  onHeadlineChange: (headlineIndex: number, value: string) => void;
  onDescriptionChange: (descIndex: number, value: string) => void;
}

const MicrosoftAdEditor: React.FC<MicrosoftAdEditorProps> = ({
  ad,
  onHeadlineChange,
  onDescriptionChange
}) => {
  // Ensure we have headline and description arrays
  const headlines = ad.headlines || [ad.headline1, ad.headline2, ad.headline3];
  const descriptions = ad.descriptions || [ad.description1, ad.description2];

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Headlines (30 char limit)</h3>
          {headlines.map((headline, index) => (
            <div key={`headline-${index}`} className="space-y-1">
              <Label htmlFor={`headline-${index}`} className="text-xs text-muted-foreground">
                Headline {index + 1}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`headline-${index}`}
                  value={headline}
                  onChange={(e) => onHeadlineChange(index, e.target.value)}
                  className="text-sm"
                  maxLength={30}
                />
                <div className="text-xs text-muted-foreground w-16 text-right">
                  {headline.length}/30
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Descriptions (90 char limit)</h3>
          {descriptions.map((description, index) => (
            <div key={`desc-${index}`} className="space-y-1">
              <Label htmlFor={`desc-${index}`} className="text-xs text-muted-foreground">
                Description {index + 1}
              </Label>
              <div className="flex items-start gap-2">
                <Textarea
                  id={`desc-${index}`}
                  value={description}
                  onChange={(e) => onDescriptionChange(index, e.target.value)}
                  className="text-sm min-h-[80px] resize-none"
                  maxLength={90}
                />
                <div className="text-xs text-muted-foreground w-16 text-right">
                  {description.length}/90
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdEditor;
