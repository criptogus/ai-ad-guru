
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
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
  const isMobile = useIsMobile();
  
  // If withSidebar is false, just return the children without SidebarProvider
  if (!withSidebar) {
    return (
      <main className="h-screen w-full overflow-y-auto bg-white dark:bg-gray-900">
        <div className="p-6 max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex overflow-hidden bg-background">
        <TooltipProvider>
          {withSidebar && (
            <Sidebar>
              <SidebarContent>
                <SidebarNavigation activePage={activePage} />
              </SidebarContent>
            </Sidebar>
          )}
        </TooltipProvider>

        {/* Main Content - removed any extra padding/margin that could cause black space */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="p-6 max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
