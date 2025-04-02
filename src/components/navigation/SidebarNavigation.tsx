
import React from 'react';
import { SidebarNavigationItems } from './SidebarNavigationItems';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter 
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SidebarCollapseButton from '@/components/layout/SidebarCollapseButton';

interface SidebarNavigationProps {
  collapsed: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed, activePage }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Sidebar variant="sidebar" collapsible={collapsed ? "icon" : "offcanvas"}>
      <SidebarHeader>
        <div className={cn(
          "flex items-center py-4 px-3", 
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && <span className="font-semibold">AdManager AI</span>}
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">A</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavigationItems collapsed={collapsed} activePage={activePage} />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-3 border-t flex items-center justify-between">
          <ThemeToggle />
          <SidebarCollapseButton 
            collapsed={collapsed} 
            onClick={toggleSidebar} 
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNavigation;
