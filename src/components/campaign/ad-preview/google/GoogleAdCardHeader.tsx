
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check, X } from "lucide-react";

interface GoogleAdCardHeaderProps {
  index: number;
  isEditing: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const GoogleAdCardHeader: React.FC<GoogleAdCardHeaderProps> = ({
  index,
  isEditing,
  onCopy,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-medium text-gray-800">Google Ad Variation {index + 1}</h3>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X size={16} className="mr-1" /> Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={onSave}>
              <Check size={16} className="mr-1" /> Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onCopy}>
              <Copy size={16} className="mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit size={16} className="mr-1" /> Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleAdCardHeader;
