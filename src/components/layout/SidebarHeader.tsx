
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "flex items-center h-16 px-3 transition-all duration-300",
      collapsed ? "justify-center" : "justify-start"
    )}>
      {collapsed ? (
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
          Z
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
            Z
          </div>
          <span className="text-xl font-bold">Zero Ad Manager</span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
