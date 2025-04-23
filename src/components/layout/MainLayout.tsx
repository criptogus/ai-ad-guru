
import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebarToggle } from "@/components/MobileSidebarToggle";
import { cn } from "@/lib/utils";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-background">
      {/* Sidebar fixed na lateral */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onClose={() => setSidebarOpen(false)}
      />
      <MobileSidebarToggle onOpen={() => setSidebarOpen(true)} />

      {/* O <main> agora usa pl-16/pl-64, nunca margin */}
      <main
        className={cn(
          "transition-all duration-300 flex-1 min-h-screen overflow-y-auto p-4 md:p-6",
          sidebarCollapsed
            ? "md:pl-16" // compensação lateral para sidebar colapsado
            : "md:pl-64" // compensação lateral para sidebar expandido
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

