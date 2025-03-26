
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import TriggerGallery from "./TriggerGallery";

interface InsertTriggerButtonProps {
  onSelectTrigger: (trigger: string) => void;
}

const InsertTriggerButton: React.FC<InsertTriggerButtonProps> = ({
  onSelectTrigger,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setIsGalleryOpen(true)}
      >
        <Lightbulb className="h-4 w-4" />
        Browse Mental Triggers
      </Button>
      
      <TriggerGallery
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        onSelectTrigger={onSelectTrigger}
      />
    </>
  );
};

export default InsertTriggerButton;
