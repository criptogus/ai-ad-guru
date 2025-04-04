
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

interface EditableAnalysisTextProps {
  text: string;
  onSave?: (text: string) => void;
}

const EditableAnalysisText: React.FC<EditableAnalysisTextProps> = ({
  text,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(editedText);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 relative">
        {!isEditing ? (
          <>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
            {onSave && (
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </>
        ) : (
          <>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full min-h-[200px] p-3 border rounded-md"
              autoFocus
            />
            <div className="flex justify-end mt-3 space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancelClick}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSaveClick}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableAnalysisText;
