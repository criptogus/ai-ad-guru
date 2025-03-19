
import React from "react";
import { 
  Copy, 
  Edit, 
  Check, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MicrosoftAdCardHeaderProps {
  index: number;
  isEditing: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const MicrosoftAdCardHeader: React.FC<MicrosoftAdCardHeaderProps> = ({
  index,
  isEditing,
  onCopy,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">Microsoft Ad Variation {index + 1}</h3>
      
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSave}
              className="text-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCopy}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MicrosoftAdCardHeader;
