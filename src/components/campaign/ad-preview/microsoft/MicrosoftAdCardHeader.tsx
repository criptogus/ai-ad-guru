
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Save, X } from "lucide-react";

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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-md font-medium">
        Microsoft Ad {adIndex + 1}
      </CardTitle>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button onClick={onSave} size="sm" variant="outline" className="h-8 px-2">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button onClick={onCancel} size="sm" variant="outline" className="h-8 px-2">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onEdit} size="sm" variant="outline" className="h-8 px-2">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button onClick={onCopy} size="sm" variant="outline" className="h-8 px-2">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  );
};

export default MicrosoftAdCardHeader;
