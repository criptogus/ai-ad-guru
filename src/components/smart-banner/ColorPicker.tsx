
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [inputColor, setInputColor] = useState(color);
  
  // Predefined color palette
  const colorPalette = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#F5F5F5", "#808080",
    "#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3",
    "#33FFF3", "#FFA07A", "#7AFFB0", "#7AA0FF", "#FFFFA0"
  ];
  
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  };
  
  const handleColorChange = (newColor: string) => {
    setInputColor(newColor);
    onChange(newColor);
  };
  
  const handleInputBlur = () => {
    onChange(inputColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-9 px-3"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: inputColor }}
            />
            <div className="grid gap-1 flex-1">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={inputColor}
                onChange={handleColorInputChange}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Color picker</Label>
            <Input
              type="color"
              value={inputColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-8 w-full p-0 border cursor-pointer"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Palette</Label>
            <div className="grid grid-cols-10 gap-1">
              {colorPalette.map((paletteColor) => (
                <button
                  key={paletteColor}
                  className="h-4 w-4 rounded-sm border"
                  style={{ backgroundColor: paletteColor }}
                  onClick={() => handleColorChange(paletteColor)}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
