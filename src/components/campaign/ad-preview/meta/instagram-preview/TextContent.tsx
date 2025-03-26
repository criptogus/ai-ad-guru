
import React from "react";

export interface TextContentProps {
  headline?: string;
  primaryText?: string;
  companyName: string;
}

const TextContent: React.FC<TextContentProps> = ({
  headline,
  primaryText,
  companyName
}) => {
  return (
    <div className="mt-2 mb-3">
      <div className="flex items-center">
        <span className="font-semibold text-sm text-black dark:text-white">
          {companyName}
        </span>
        {headline && (
          <span className="ml-1 text-sm text-black dark:text-white">
            {headline}
          </span>
        )}
      </div>
      {primaryText && (
        <p className="text-sm mt-1 text-black dark:text-white">
          {primaryText}
        </p>
      )}
    </div>
  );
};

export default TextContent;
