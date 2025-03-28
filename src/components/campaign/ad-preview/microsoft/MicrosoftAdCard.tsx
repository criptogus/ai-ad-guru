
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleAd } from "@/hooks/adGeneration";
import { MicrosoftAdCardHeader } from "./MicrosoftAdCardHeader";
import { MicrosoftAdPreview } from "./MicrosoftAdPreview";

export interface MicrosoftAdCardProps {
  ad: GoogleAd;
  index: number;
  domain?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

export const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({
  ad,
  index,
  domain = "example.com",
  isSelected = false,
  onSelect,
  onUpdate,
}) => {
  return (
    <Card className={`${isSelected ? 'border-primary shadow-sm' : ''} transition-all`}>
      <MicrosoftAdCardHeader 
        label={`Variation ${index + 1}`} 
        isSelected={isSelected}
      />
      <CardContent className="pt-4 pb-2">
        <MicrosoftAdPreview ad={ad} domain={domain} onUpdate={onUpdate} />
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm" 
          className="w-full" 
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MicrosoftAdCard;
