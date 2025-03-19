
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAd } from "@/hooks/adGeneration";

interface NewGoogleAdFormProps {
  newAd: {
    headlines: string[];
    descriptions: string[];
  };
  setNewAd: React.Dispatch<React.SetStateAction<{
    headlines: string[];
    descriptions: string[];
  }>>;
  onAddTestAd: () => void;
}

const NewGoogleAdForm: React.FC<NewGoogleAdFormProps> = ({ 
  newAd, 
  setNewAd, 
  onAddTestAd 
}) => {
  const handleHeadlineChange = (value: string, index: number) => {
    const updatedHeadlines = [...newAd.headlines];
    updatedHeadlines[index] = value;
    setNewAd({ ...newAd, headlines: updatedHeadlines });
  };

  const handleDescriptionChange = (value: string, index: number) => {
    const updatedDescriptions = [...newAd.descriptions];
    updatedDescriptions[index] = value;
    setNewAd({ ...newAd, descriptions: updatedDescriptions });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="headline1">Headline 1</Label>
          <Input
            id="headline1"
            value={newAd.headlines[0] || ""}
            onChange={(e) => handleHeadlineChange(e.target.value, 0)}
            placeholder="Main headline"
          />
        </div>
        <div>
          <Label htmlFor="headline2">Headline 2</Label>
          <Input
            id="headline2"
            value={newAd.headlines[1] || ""}
            onChange={(e) => handleHeadlineChange(e.target.value, 1)}
            placeholder="Second headline"
          />
        </div>
        <div>
          <Label htmlFor="headline3">Headline 3</Label>
          <Input
            id="headline3"
            value={newAd.headlines[2] || ""}
            onChange={(e) => handleHeadlineChange(e.target.value, 2)}
            placeholder="Third headline"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description1">Description 1</Label>
          <Input
            id="description1"
            value={newAd.descriptions[0] || ""}
            onChange={(e) => handleDescriptionChange(e.target.value, 0)}
            placeholder="First description line"
          />
        </div>
        <div>
          <Label htmlFor="description2">Description 2</Label>
          <Input
            id="description2"
            value={newAd.descriptions[1] || ""}
            onChange={(e) => handleDescriptionChange(e.target.value, 1)}
            placeholder="Second description line"
          />
        </div>
      </div>

      <Button onClick={onAddTestAd} className="w-full">
        Add Test Ad
      </Button>
    </div>
  );
};

export default NewGoogleAdForm;
