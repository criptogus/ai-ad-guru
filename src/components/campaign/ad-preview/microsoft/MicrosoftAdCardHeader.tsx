
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, Copy } from "lucide-react";

interface MicrosoftAdCardHeaderProps {
  adIndex: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopy: () => void;
}

const MicrosoftAdCardHeader: React.FC<MicrosoftAdCardHeaderProps> = ({
  adIndex,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4">
      <CardTitle className="text-sm">Microsoft Ad Variation {adIndex + 1}</CardTitle>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  );
};

export default MicrosoftAdCardHeader;
