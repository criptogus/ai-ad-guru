
import React from "react";

interface TabHeaderProps {
  title: string;
  description?: string;
}

const TabHeader: React.FC<TabHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};

export default TabHeader;
