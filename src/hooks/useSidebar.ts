
import { useState } from "react";

export const useSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return { isCollapsed, setIsCollapsed };
};
