
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarCollapseButtonProps {
  collapsed: boolean;
  onClick: () => void;
}

const SidebarCollapseButton: React.FC<SidebarCollapseButtonProps> = ({ 
  collapsed, 
  onClick 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          className={cn(
            "rounded-full bg-primary text-primary-foreground p-1.5 hover:bg-primary/90 transition-all duration-200 active:scale-95",
            "flex items-center justify-center shadow-md"
          )}
          onClick={onClick}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarCollapseButton;
