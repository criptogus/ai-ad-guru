
import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // On mobile, sidebar should be collapsed by default
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <Sidebar 
          activePage={activePage}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
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
