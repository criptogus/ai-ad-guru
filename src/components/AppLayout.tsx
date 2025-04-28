
import React, { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

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
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);
  
  // If withSidebar is false, only return the children without any layout
  if (!withSidebar) {
    return (
      <main className="h-screen w-full overflow-y-auto bg-background dark:bg-gray-900">
        {children}
      </main>
    );
  }
  
  // The sidebar is now managed by MainLayout
  return (
    <TooltipProvider>
      <div className="h-screen w-full overflow-y-auto bg-background dark:bg-gray-900">
        {children}
      </div>
    </TooltipProvider>
  );
};

export default AppLayout;
