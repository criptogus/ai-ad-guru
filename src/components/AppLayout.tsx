
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import { useSidebar } from "@/hooks/useSidebar";
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
  
  // We'll use this hook inside the SidebarProvider
  const AppLayoutContent = ({ children, activePage, withSidebar }: AppLayoutProps) => {
    const { isCollapsed } = useSidebar();
    
    return (
      <div className="h-screen w-full flex overflow-hidden bg-background">
        {withSidebar && (
          <SidebarNavigation 
            collapsed={isCollapsed} 
            activePage={activePage}
          />
        )}

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto bg-white dark:bg-gray-900">
          <div className="p-6 max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  };
  
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
      <TooltipProvider>
        <AppLayoutContent activePage={activePage} withSidebar={withSidebar}>
          {children}
        </AppLayoutContent>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
