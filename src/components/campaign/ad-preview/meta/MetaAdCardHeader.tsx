
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check, X } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MetaAdCardHeaderProps {
  index: number;
  isEditing: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const MetaAdCardHeader: React.FC<MetaAdCardHeaderProps> = ({
  index,
  isEditing,
  onCopy,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-800">Meta/Instagram Ad Variation {index + 1}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel}
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSave}
              >
                <Check size={16} className="mr-1" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCopy}
              >
                <Copy size={16} className="mr-1" /> Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
              >
                <Edit size={16} className="mr-1" /> Edit
              </Button>
            </>
          )}
        </div>
      </div>
      
      {index === 0 && (
        <Alert className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This ad will be automatically optimized based on campaign performance.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default MetaAdCardHeader;
