
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";

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
  
  // If withSidebar is false, just return the children without the sidebar
  if (!withSidebar) {
    return (
      <main className="h-screen w-full overflow-y-auto bg-[#0c121f]">
        {children}
      </main>
    );
  }
  
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0c121f]">
      {withSidebar && (
        <TooltipProvider>
          <SidebarNavigation activePage={activePage} />
        </TooltipProvider>
      )}

      {/* Main Content - Using flex-1 to take all available space */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
