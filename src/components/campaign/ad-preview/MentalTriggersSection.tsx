
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import TriggerGallery from "@/components/mental-triggers/TriggerGallery";

interface MentalTriggersSectionProps {
  onSelectTrigger: (trigger: string) => void;
}

const MentalTriggersSection: React.FC<MentalTriggersSectionProps> = ({
  onSelectTrigger,
}) => {
  const [openTriggerGallery, setOpenTriggerGallery] = useState(false);

  const handleSelectTrigger = (trigger: string) => {
    onSelectTrigger(trigger);
    // Do not navigate to next step, just close the gallery
    setOpenTriggerGallery(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mental Triggers</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Add psychological triggers to make your ads more compelling and drive better conversion rates.
        </p>
        
        <Button 
          onClick={(e) => {
            e.preventDefault(); // Prevent any form submission
            setOpenTriggerGallery(true);
          }} 
          variant="outline"
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Browse Mental Triggers
        </Button>
        
        <TriggerGallery
          open={openTriggerGallery}
          onOpenChange={setOpenTriggerGallery}
          onSelectTrigger={handleSelectTrigger}
        />
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
