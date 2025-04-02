
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import { useSidebar } from "@/hooks/useSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Unified Sidebar */}
        <SidebarNavigation 
          collapsed={isCollapsed} 
          activePage={activePage}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-4 md:p-6 max-w-[1400px] mx-auto transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
