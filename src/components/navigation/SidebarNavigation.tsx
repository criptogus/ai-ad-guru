
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarNavigationProps {
  collapsed: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed, activePage }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <aside className={cn(
      "h-full border-r border-border bg-gray-50 dark:bg-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center py-4 px-4", 
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && <span className="font-semibold text-lg font-inter">AdManager AI</span>}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <SidebarNavigationItems collapsed={collapsed} activePage={activePage} />
        </div>
        
        <div className="p-4 border-t flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={collapsed ? "mx-auto" : ""}>
                <ThemeToggle />
              </div>
            </TooltipTrigger>
            {collapsed && <TooltipContent>Toggle theme</TooltipContent>}
          </Tooltip>
          
          <SidebarCollapseButton 
            collapsed={collapsed} 
            onClick={toggleSidebar} 
          />
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
