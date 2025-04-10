
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Check, X } from 'lucide-react';

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

  const handleSave = () => {
    if (onSave) {
      onSave(editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  // Update local state when props change
  React.useEffect(() => {
    setEditedText(text);
  }, [text]);

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea 
          value={editedText} 
          onChange={(e) => setEditedText(e.target.value)}
          className="min-h-[200px]"
        />
        <div className="flex space-x-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative bg-card rounded-md border p-4">
        <div className="whitespace-pre-wrap">{text}</div>
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-1 h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableAnalysisText;
