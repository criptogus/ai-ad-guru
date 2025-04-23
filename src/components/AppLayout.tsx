
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  withSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activePage = "dashboard", 
  withSidebar = true 
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Se withSidebar é false, apenas retorna o children sem o sidebar
  if (!withSidebar) {
    return (
      <main className="h-screen w-full overflow-y-auto bg-background dark:bg-gray-900">
        {children}
      </main>
    );
  }
  
  return (
    <TooltipProvider>
      <MainLayout>
        {children}
      </MainLayout>
    </TooltipProvider>
  );
};

export default AppLayout;
