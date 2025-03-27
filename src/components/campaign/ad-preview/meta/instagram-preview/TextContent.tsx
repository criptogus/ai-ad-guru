
import React from "react";

interface TextContentProps {
  headline?: string;
  primaryText: string;
  companyName: string;
}

const TextContent: React.FC<TextContentProps> = ({
  headline,
  primaryText,
  companyName
}) => {
  return (
    <div className="mt-2">
      <div className="flex items-start space-x-1">
        <p className="text-sm font-semibold">{companyName}</p>
        <p className="text-sm whitespace-pre-line">{primaryText}</p>
      </div>
      {headline && <p className="text-sm font-medium mt-1">{headline}</p>}
    </div>
  );
};

export default TextContent;
