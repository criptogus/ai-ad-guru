
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import { useSidebar } from "@/hooks/useSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const { isCollapsed } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar Navigation */}
        <SidebarNavigation 
          collapsed={isCollapsed} 
          activePage={activePage}
        />

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-6 max-w-[1400px] mx-auto transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
