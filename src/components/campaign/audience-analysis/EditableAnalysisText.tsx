
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="relative border rounded-md overflow-hidden bg-card">
      <div className="absolute top-2 right-2 z-10">
        {isEditing ? (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSave}
            className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border-primary"
          >
            <Save size={14} />
            Save
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
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
          className="min-h-[600px] p-6 border-0 rounded-none focus-visible:ring-0 dark:bg-gray-900/90 dark:text-gray-100"
        />
      ) : (
        <ScrollArea className="h-[600px] w-full">
          <div 
            className="prose prose-sm max-w-none dark:prose-invert p-6"
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        </ScrollArea>
      )}
    </div>
  );
};

export default EditableAnalysisText;
