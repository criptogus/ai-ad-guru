
import React from 'react';
import { Link } from 'react-router-dom';
import navigationItems from './SidebarNavigationItems';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  collapsed: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed, activePage }) => {
  return (
    <div className="flex-1 py-6">
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = item.activePattern.test(`/${activePage}`);
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center"
              )}
            >
              <IconComponent className={cn("h-5 w-5", collapsed ? "mx-0" : "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
