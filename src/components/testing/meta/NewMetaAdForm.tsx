
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";

interface NewMetaAdFormProps {
  newAd: MetaAd;
  setNewAd: React.Dispatch<React.SetStateAction<MetaAd>>;
  onAddTestAd: () => void;
}

const NewMetaAdForm: React.FC<NewMetaAdFormProps> = ({ 
  newAd, 
  setNewAd, 
  onAddTestAd 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primaryText">Primary Text</Label>
          <Textarea 
            id="primaryText" 
            value={newAd.primaryText}
            onChange={(e) => setNewAd({...newAd, primaryText: e.target.value})}
            className="min-h-[80px]"
          />
        </div>
        <div>
          <Label htmlFor="headline">Headline</Label>
          <Input 
            id="headline" 
            value={newAd.headline}
            onChange={(e) => setNewAd({...newAd, headline: e.target.value})}
          />
          
          <Label htmlFor="description" className="mt-4">Description</Label>
          <Input 
            id="description" 
            value={newAd.description}
            onChange={(e) => setNewAd({...newAd, description: e.target.value})}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="imagePrompt">Image Prompt</Label>
        <Textarea 
          id="imagePrompt" 
          value={newAd.imagePrompt}
          onChange={(e) => setNewAd({...newAd, imagePrompt: e.target.value})}
          className="min-h-[100px]"
        />
      </div>
      
      <Button onClick={onAddTestAd}>Add Test Ad</Button>
    </div>
  );
};

export default NewMetaAdForm;
