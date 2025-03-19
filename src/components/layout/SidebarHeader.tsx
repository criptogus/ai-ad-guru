
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className={cn("mb-6 flex items-center", collapsed ? "justify-center" : "gap-2")}>
      <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
        AG
      </div>
      {!collapsed && <h1 className="text-lg font-medium">Ad Manager</h1>}
    </div>
  );
};

export default SidebarHeader;
