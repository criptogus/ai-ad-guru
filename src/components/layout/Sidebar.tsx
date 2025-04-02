
// This file is deprecated and should not be used.
// Use SidebarNavigation from @/components/navigation/SidebarNavigation instead.
// This file is kept for backward compatibility and will be removed in the future.

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigationItems from "./SidebarNavigationItems";
import SidebarCollapseButton from "./SidebarCollapseButton";
import ThemeToggle from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar as DeprecatedSidebar } from "@/components/ui/sidebar"; 

export interface SidebarProps {
  activePage?: string;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

// This component is deprecated
const Sidebar: React.FC<SidebarProps> = ({
  activePage = "dashboard",
  children,
  isCollapsed,
  setIsCollapsed
}) => {
  console.warn("Using deprecated Sidebar component. Please use SidebarNavigation instead.");
  
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(isCollapsed || false);
  
  // Sync with props if provided
  useEffect(() => {
    if (isCollapsed !== undefined) {
      setCollapsed(isCollapsed);
    }
  }, [isCollapsed]);

  // On mobile, sidebar should be collapsed by default
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Handle toggle sidebar
  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (setIsCollapsed) {
      setIsCollapsed(newCollapsedState);
    }
  };

  return (
    <DeprecatedSidebar>
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
            onClick={toggleSidebar} 
          />
        </div>
      </div>
    </DeprecatedSidebar>
  );
};

export default Sidebar;
