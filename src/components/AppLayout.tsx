
import React, { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  withSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activePage = "dashboard", 
  withSidebar = true 
}) => {
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-background dark:bg-gray-900 p-4">
        {children}
      </div>
    </TooltipProvider>
  );
};

export default AppLayout;
