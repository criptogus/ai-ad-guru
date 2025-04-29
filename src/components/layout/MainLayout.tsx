
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNavigation } from "@/components/navigation";
import { MobileSidebarToggle } from "@/components/MobileSidebarToggle";
import { NavigationSetup } from "@/components/NavigationSetup";
import { cn } from "@/lib/utils";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <NavigationSetup>
      <div className="relative flex w-full bg-background dark:bg-gray-900">
        <SidebarNavigation 
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          onClose={() => setSidebarOpen(false)}
        />
        
        <MobileSidebarToggle onOpen={() => setSidebarOpen(true)} />

        <main
          className={cn(
            "flex-1 min-h-screen w-full",
            sidebarCollapsed 
              ? "md:ml-16" // Reduced side margin for collapsed sidebar
              : "md:ml-64" // Standard margin for expanded sidebar
          )}
        >
          <Outlet />
        </main>
      </div>
    </NavigationSetup>
  );
};

export default MainLayout;
