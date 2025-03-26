
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import TriggerGallery from "@/components/mental-triggers/TriggerGallery";

interface TriggerButtonInlineProps {
  onInsert: (text: string) => void;
  className?: string;
}

const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({
  onInsert,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`h-7 px-2 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Lightbulb className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">Triggers</span>
      </Button>
      
      <TriggerGallery
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelectTrigger={onInsert}
      />
    </>
  );
};

export default TriggerButtonInline;
