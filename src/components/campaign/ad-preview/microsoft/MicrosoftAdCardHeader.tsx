
import React from "react";
import { CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface MicrosoftAdCardHeaderProps {
  label: string;
  isSelected?: boolean;
}

export const MicrosoftAdCardHeader: React.FC<MicrosoftAdCardHeaderProps> = ({
  label,
  isSelected = false,
}) => {
  return (
    <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
      <div className="text-sm font-medium">{label}</div>
      {isSelected && (
        <div className="flex items-center text-xs text-primary">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          <span>Selected</span>
        </div>
      )}
    </CardHeader>
  );
};
