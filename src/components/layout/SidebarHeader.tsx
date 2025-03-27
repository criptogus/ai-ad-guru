
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "flex items-center mb-6 transition-all",
      collapsed ? "justify-center" : "px-2"
    )}>
      {collapsed ? (
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
          A
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
            A
          </div>
          <span className="text-xl font-bold">AI Ad Manager</span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
