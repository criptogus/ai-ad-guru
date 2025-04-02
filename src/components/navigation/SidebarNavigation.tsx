
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoutAction } from '@/hooks/auth/useLogoutAction';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SidebarCollapseButton from '@/components/layout/SidebarCollapseButton';
import SidebarNavigationItems from '@/components/navigation/SidebarNavigationItems';

export interface SidebarNavigationProps {
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activePage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { logout, isLoading } = useLogoutAction(setUser, navigate);
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const collapsed = sidebarState === "collapsed";

  return (
    <div className="flex flex-col h-full bg-[#0c121f]">
      {/* App title and logo */}
      <div className={`flex items-center py-4 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && <span className="font-semibold text-lg font-inter text-white">AdManager AI</span>}
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-sm font-bold text-white">A</span>
        </div>
      </div>
      
      {/* Navigation items */}
      <div className="flex-1 px-2 py-2">
        <SidebarNavigationItems activePage={activePage} collapsed={collapsed} />
      </div>
      
      {/* Theme toggle and collapse button */}
      <div className="border-t border-gray-800 p-4 flex items-center justify-between">
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
