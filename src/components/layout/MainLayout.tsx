
import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebarToggle } from "@/components/MobileSidebarToggle";
import { cn } from "@/lib/utils";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative h-screen w-full flex bg-gray-50 dark:bg-background">
      {/* Sidebar fixed na lateral */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onClose={() => setSidebarOpen(false)}
      />
      <MobileSidebarToggle onOpen={() => setSidebarOpen(true)} />

      {/* Main content area com compensação para sidebar */}
      <main
        className={cn(
          "flex-1 h-screen overflow-y-auto p-4 md:p-6",
          sidebarCollapsed
            ? "md:pl-12" // Reduced side padding for collapsed sidebar
            : "md:pl-16" // Reduced side padding for expanded sidebar
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
