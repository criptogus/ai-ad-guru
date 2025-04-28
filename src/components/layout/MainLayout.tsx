
import React, { useState } from "react";
import { SidebarNavigation } from "@/components/navigation";
import { MobileSidebarToggle } from "@/components/MobileSidebarToggle";
import { cn } from "@/lib/utils";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative h-screen w-full flex bg-background dark:bg-gray-900">
      {/* Sidebar fixed on the side */}
      <SidebarNavigation 
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onClose={() => setSidebarOpen(false)}
      />
      
      <MobileSidebarToggle onOpen={() => setSidebarOpen(true)} />

      {/* Main content area with compensation for sidebar */}
      <main
        className={cn(
          "flex-1 h-screen overflow-y-auto p-4",
          sidebarCollapsed 
            ? "md:ml-16" // Reduced side margin for collapsed sidebar
            : "md:ml-64" // Standard margin for expanded sidebar
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
