
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn(
        "rounded-md bg-primary text-primary-foreground p-1.5 hover:bg-primary/90 transition-all duration-200 active:scale-95",
        "flex items-center justify-center"
      )}
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  );
};

export default SidebarCollapseButton;
