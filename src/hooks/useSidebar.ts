
import { useState } from "react";

export interface SidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const useSidebar = (): SidebarState => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return { isCollapsed, setIsCollapsed };
};
