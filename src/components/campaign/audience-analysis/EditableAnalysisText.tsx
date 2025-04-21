
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Check, X } from "lucide-react";

interface EditableAnalysisTextProps {
  text: string;
  formattedHtml?: string;
  onSave: (text: string) => void;
}

const EditableAnalysisText: React.FC<EditableAnalysisTextProps> = ({
  text,
  formattedHtml,
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

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center p-3 border-b bg-muted/30">
        <h3 className="font-medium">Audience Analysis</h3>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="p-3">
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={10}
            className="w-full"
            placeholder="Enter audience analysis here..."
          />
          <div className="mt-2 text-xs text-muted-foreground">
            <p>You can use Markdown formatting:</p>
            <ul className="list-disc ml-4">
              <li>**bold text**</li>
              <li># Heading 1, ## Heading 2, ### Heading 3</li>
              <li>- List item or * List item</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-4 prose prose-sm max-w-none dark:prose-invert">
          {formattedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
          ) : (
            <pre className="whitespace-pre-wrap">{text}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableAnalysisText;
