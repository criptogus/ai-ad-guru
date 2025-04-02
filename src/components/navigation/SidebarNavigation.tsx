
import React from 'react';
import { SidebarNavigationItems } from './SidebarNavigationItems';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useSidebar } from '@/components/ui/sidebar';
import SidebarCollapseButton from '@/components/layout/SidebarCollapseButton';
import { TooltipProvider } from '@/components/ui/tooltip';

interface SidebarNavigationProps {
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activePage }) => {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
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
      
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className={collapsed ? "mx-auto" : ""}>
          <ThemeToggle />
        </div>
        
        {!collapsed && (
          <SidebarCollapseButton 
            collapsed={collapsed} 
            onClick={toggleSidebar} 
          />
        )}
        
        {collapsed && (
          <div className="absolute bottom-4 right-0 transform translate-x-1/2">
            <SidebarCollapseButton 
              collapsed={collapsed} 
              onClick={toggleSidebar} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarNavigation;
