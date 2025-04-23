
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";

interface EditableAnalysisTextProps {
  text: string;
  formattedHtml: string;
  onSave: (text: string) => void;
}

const EditableAnalysisText: React.FC<EditableAnalysisTextProps> = ({
  text,
  formattedHtml,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSave = () => {
    onSave(editedText);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        {isEditing ? (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSave}
            className="flex items-center gap-1"
          >
            <Save size={14} />
            Save
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Edit size={14} />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="min-h-[300px]"
        />
      ) : (
        <div 
          className="prose prose-sm max-w-none dark:prose-invert p-4 border rounded-md"
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
        />
      )}
    </div>
  );
};

export default EditableAnalysisText;
