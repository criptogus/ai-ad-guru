
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
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
  
  console.log("AppLayout rendering with activePage:", activePage); // Add logging
  
  // If withSidebar is false, just return the children without the sidebar
  if (!withSidebar) {
    return (
      <main className="h-screen w-full overflow-y-auto bg-background dark:bg-gray-900">
        {children}
      </main>
    );
  }
  
  return (
    <div className="h-screen w-full flex overflow-hidden bg-background dark:bg-gray-900">
      {withSidebar && (
        <TooltipProvider>
          <SidebarNavigation activePage={activePage} />
        </TooltipProvider>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="w-full h-full overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
