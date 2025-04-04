
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X, Edit, Copy, Trash } from "lucide-react";

interface LinkedInAdCardHeaderProps {
  adIndex: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

const LinkedInAdCardHeader: React.FC<LinkedInAdCardHeaderProps> = ({
  adIndex, 
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onDelete
}) => {
  return (
    <div className="flex justify-between items-center bg-muted p-3 border-b">
      <h3 className="text-sm font-medium">LinkedIn Ad #{adIndex + 1}</h3>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <>
            {onCopy && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCopy}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LinkedInAdCardHeader;
