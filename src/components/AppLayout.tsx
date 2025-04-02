
import React, { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import { useSidebar } from "@/hooks/useSidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const { isCollapsed } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background overflow-hidden">
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
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AppLayout;
