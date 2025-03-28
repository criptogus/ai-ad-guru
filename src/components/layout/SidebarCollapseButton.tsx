
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
      className="rounded-full bg-primary text-primary-foreground p-1 hover:bg-primary/90 transition-colors"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  );
};

export default SidebarCollapseButton;
