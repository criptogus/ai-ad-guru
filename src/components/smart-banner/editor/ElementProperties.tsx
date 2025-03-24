
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { BannerElement } from "@/hooks/smart-banner/types";
import ColorPicker from "../ColorPicker";

interface ElementPropertiesProps {
  element: BannerElement;
  onUpdateElement: (property: string, value: any) => void;
}

const ElementProperties: React.FC<ElementPropertiesProps> = ({
  element,
  onUpdateElement
}) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base">Element Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Position X</Label>
          <Slider 
            value={[element.x]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => onUpdateElement('x', value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Position Y</Label>
          <Slider 
            value={[element.y]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => onUpdateElement('y', value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Top</span>
            <span>Bottom</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Scale</Label>
          <Slider 
            value={[element.scale || 100]} 
            min={50} 
            max={200} 
            step={1}
            onValueChange={(value) => onUpdateElement('scale', value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50%</span>
            <span>200%</span>
          </div>
        </div>
        
        {element.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Slider 
                value={[element.fontSize || 16]} 
                min={12} 
                max={72} 
                step={1}
                onValueChange={(value) => onUpdateElement('fontSize', value[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <ColorPicker 
                color={element.color || '#000000'} 
                onChange={(color) => onUpdateElement('color', color)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ElementProperties;
