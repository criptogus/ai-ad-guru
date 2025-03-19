
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarCollapseButtonProps {
  collapsed: boolean;
  onClick: () => void;
}

const SidebarCollapseButton: React.FC<SidebarCollapseButtonProps> = ({ 
  collapsed, 
  onClick 
}) => {
  return (
    <button 
      className="absolute -right-3 top-12 rounded-full bg-blue-600 text-white p-1 shadow-md hover:bg-blue-700 transition-colors"
      onClick={onClick}
    >
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  );
};

export default SidebarCollapseButton;
