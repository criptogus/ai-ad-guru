
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface SidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

// Sidebar state persistence key
const SIDEBAR_STATE_KEY = "sidebar-state";

export const useSidebar = (): SidebarState => {
  const isMobile = useIsMobile();
  
  // Initialize from localStorage if available, otherwise default to mobile state
  const getSavedState = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
      if (saved !== null) {
        return saved === "true";
      }
    }
    return isMobile;
  };

  const [isCollapsed, setIsCollapsed] = useState(getSavedState);

  useEffect(() => {
    // Update collapse state when mobile state changes
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed));
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return { isCollapsed, setIsCollapsed, toggleSidebar };
};
