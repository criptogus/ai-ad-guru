
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoutAction } from '@/hooks/auth/useLogoutAction';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SidebarNavigationItems from '@/components/navigation/SidebarNavigationItems';
import { cn } from '@/lib/utils';

export interface SidebarNavigationProps {
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activePage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { logout } = useLogoutAction(setUser);
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  console.log("SidebarNavigation rendering with activePage:", activePage); // Add logging

  return (
    <div className={cn(
      "h-full bg-gray-50 dark:bg-[#0c121f] border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      {/* App title and logo */}
      <div className={`flex items-center py-4 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && <span className="font-semibold text-lg font-inter text-gray-800 dark:text-white">AdManager AI</span>}
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-sm font-bold text-white">A</span>
        </div>
      </div>
      
      {/* Navigation items */}
      <div className="flex-1 px-2 py-2">
        <SidebarNavigationItems activePage={activePage} collapsed={collapsed} />
      </div>
      
      {/* Theme toggle and collapse button */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className={collapsed ? "mx-auto" : ""}>
          <ThemeToggle />
        </div>
        
        {!collapsed && (
          <button 
            className="rounded-full bg-blue-500 text-white p-1.5 hover:bg-blue-600 transition-all duration-200 active:scale-95"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
        
        {collapsed && (
          <button
            className="absolute right-0 transform translate-x-1/2 bottom-4 rounded-full bg-blue-500 text-white p-1.5 hover:bg-blue-600 transition-all duration-200 active:scale-95"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarNavigation;
