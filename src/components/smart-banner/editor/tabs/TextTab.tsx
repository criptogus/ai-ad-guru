
import React from "react";
import TextPromptForm from "../../TextPromptForm";
import { TextElement } from "@/hooks/smart-banner/types";

interface TextTabProps {
  textElements: TextElement[];
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onGenerateAIText: (elementId: string, type: "headline" | "subheadline" | "cta") => Promise<void>;
}

const TextTab: React.FC<TextTabProps> = ({
  textElements,
  onUpdateTextElement,
  onGenerateAIText
}) => {
  return (
    <div className="space-y-4">
      <TextPromptForm 
        textElements={textElements}
        onUpdateTextElement={onUpdateTextElement}
        onGenerateAIText={onGenerateAIText}
      />
    </div>
  );
};

export default TextTab;
