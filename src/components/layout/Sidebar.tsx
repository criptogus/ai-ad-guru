
import React from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigationItems from "./SidebarNavigationItems";
import SidebarCollapseButton from "./SidebarCollapseButton";
import ThemeToggle from "./ThemeToggle";
import { useSidebar } from "@/hooks/useSidebar";

export interface SidebarProps {
  activePage?: string;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage = "dashboard",
  children,
  isCollapsed,
  setIsCollapsed
}) => {
  const sidebarState = useSidebar();
  // Use the props if provided, otherwise use the hook state
  const collapsed = isCollapsed !== undefined ? isCollapsed : sidebarState.isCollapsed;
  const toggleCollapsed = setIsCollapsed || sidebarState.setIsCollapsed;

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-background transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <SidebarHeader collapsed={collapsed} />
        
        <div className="flex-1 overflow-y-auto scrollbar-none px-3 py-2">
          <SidebarNavigationItems activePage={activePage} collapsed={collapsed} />
          {children}
        </div>
        
        <div className="p-3 border-t flex items-center justify-between">
          <ThemeToggle />
          <SidebarCollapseButton 
            collapsed={collapsed} 
            onClick={() => toggleCollapsed(!collapsed)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
