
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface SidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

export const useSidebar = (): SidebarState => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    // Update collapse state when mobile state changes
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return { isCollapsed, setIsCollapsed, toggleSidebar };
};
