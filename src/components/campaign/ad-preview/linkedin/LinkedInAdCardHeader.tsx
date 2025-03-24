
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, Linkedin, Copy } from "lucide-react";

interface LinkedInAdCardHeaderProps {
  adIndex: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopy?: () => void;
}

const LinkedInAdCardHeader: React.FC<LinkedInAdCardHeaderProps> = ({
  adIndex,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
      <CardTitle className="text-lg flex items-center gap-2">
        <Linkedin className="h-5 w-5 text-blue-700" />
        <span>LinkedIn Ad {adIndex + 1}</span>
      </CardTitle>
      
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="text-green-600 hover:text-green-700"
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
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  );
};

export default LinkedInAdCardHeader;
