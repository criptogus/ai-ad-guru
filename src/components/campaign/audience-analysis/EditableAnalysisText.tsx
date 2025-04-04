
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";

interface EditableAnalysisTextProps {
  text: string;
  onSave: (text: string) => void;
}

const EditableAnalysisText: React.FC<EditableAnalysisTextProps> = ({
  text,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const handleSave = () => {
    onSave(editedText);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[150px] text-sm"
          />
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="group relative">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {text}
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableAnalysisText;
