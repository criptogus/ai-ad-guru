
import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activePage={activePage} 
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-[1400px] mx-auto transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
