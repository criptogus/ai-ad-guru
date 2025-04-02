
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
        {children}
      </main>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <TooltipProvider>
          {withSidebar && (
            <Sidebar variant="sidebar">
              <SidebarContent>
                <SidebarNavigation activePage={activePage} />
              </SidebarContent>
            </Sidebar>
          )}
        </TooltipProvider>

        {/* Main Content - Remove w-full to avoid extra space */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
