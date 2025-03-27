
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Save, X, Copy as Duplicate, Trash } from "lucide-react";

interface AdCardHeaderProps {
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopy: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const AdCardHeader: React.FC<AdCardHeaderProps> = ({
  index,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="flex justify-between items-center bg-muted p-3 border-b">
      <h3 className="text-sm font-medium">Instagram Ad #{index + 1}</h3>
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCopy}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDuplicate}
              >
                <Duplicate className="h-4 w-4 mr-1" />
                Duplicate
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-600"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdCardHeader;
