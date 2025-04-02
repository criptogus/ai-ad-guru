
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
    <Sidebar 
      variant="sidebar" 
      collapsible={collapsed ? "icon" : "offcanvas"}
      className="border-r border-border bg-gray-50 dark:bg-gray-800"
    >
      <SidebarHeader>
        <div className={cn(
          "flex items-center py-4 px-4", 
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && <span className="font-semibold text-lg font-inter">AdManager AI</span>}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarNavigationItems collapsed={collapsed} activePage={activePage} />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 border-t flex items-center justify-between">
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
