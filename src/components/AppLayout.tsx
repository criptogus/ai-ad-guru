
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import { useSidebar } from "@/hooks/useSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const isMobile = useIsMobile();
  
  // We'll use this hook inside the SidebarProvider
  const AppLayoutContent = ({ children, activePage }: AppLayoutProps) => {
    const { isCollapsed } = useSidebar();
    
    return (
      <div className="h-screen w-full flex overflow-hidden bg-background">
        {/* Sidebar Navigation */}
        <SidebarNavigation 
          collapsed={isCollapsed} 
          activePage={activePage}
        />

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto bg-white dark:bg-gray-800">
          <div className="p-6 max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  };
  
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppLayoutContent activePage={activePage}>
          {children}
        </AppLayoutContent>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
