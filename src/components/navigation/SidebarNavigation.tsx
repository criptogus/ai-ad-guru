
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart,
  Settings, 
  Users,
  CreditCard,
  Megaphone,
  Compass,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoutAction } from '@/hooks/auth/useLogoutAction';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SidebarCollapseButton from '@/components/layout/SidebarCollapseButton';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';

export interface SidebarNavigationItemsProps {
  collapsed?: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationItemsProps> = ({ activePage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { logout, isLoading } = useLogoutAction(setUser, navigate);
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const collapsed = sidebarState === "collapsed";

  const items = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: currentPath === '/dashboard' || currentPath === '/' || activePage === 'dashboard',
    },
    {
      name: 'Campaigns',
      icon: Megaphone,
      path: '/campaigns',
      active: currentPath.includes('/campaigns') || activePage === 'campaigns',
    },
    {
      name: 'Analytics',
      icon: BarChart,
      path: '/analytics',
      active: currentPath.includes('/analytics') || activePage === 'analytics',
    },
    {
      name: 'Credits',
      icon: CreditCard,
      path: '/credits-info',
      active: currentPath.includes('/credits') || activePage === 'credits',
    },
    {
      name: 'Team',
      icon: Users,
      path: '/roles',
      active: currentPath.includes('/roles') || activePage === 'team' || activePage === 'roles',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      active: currentPath.includes('/settings') || activePage === 'settings',
    },
    {
      name: 'Support',
      icon: Compass,
      path: '/support',
      active: currentPath.includes('/support') || activePage === 'support',
    },
  ];

  return (
    <Sidebar className="border-r border-gray-800 bg-[#0c121f]">
      <div className="flex flex-col h-full bg-[#0c121f]">
        {/* App title and logo */}
        <div className={cn(
          "flex items-center py-4 px-4", 
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && <span className="font-semibold text-lg font-inter text-white">AdManager AI</span>}
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">A</span>
          </div>
        </div>
        
        {/* Navigation items */}
        <div className="flex-1 px-2 py-2">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center rounded-md transition-colors my-1",
                item.active 
                  ? "bg-[#131f35] text-white" 
                  : "text-gray-400 hover:bg-[#131f35] hover:text-white",
                "px-3 py-2.5"
              )}
            >
              <item.icon size={20} className={cn(collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </div>
        
        {/* Logout Button */}
        <div className="px-2 pb-4 pt-2">
          <button
            onClick={logout}
            disabled={isLoading}
            className={cn(
              "flex items-center rounded-md transition-colors w-full",
              "text-red-500 hover:bg-[#131f35]",
              "px-3 py-2.5"
            )}
          >
            <LogOut size={20} className={cn(collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
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
    </Sidebar>
  );
};

export default SidebarNavigation;
