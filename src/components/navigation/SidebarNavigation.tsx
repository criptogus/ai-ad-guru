
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
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useSidebar } from '@/components/ui/sidebar';
import SidebarCollapseButton from '@/components/layout/SidebarCollapseButton';

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
      
      <TooltipProvider delayDuration={100}>
        <div className="flex-1 overflow-y-auto p-2">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      className={cn(
                        "rounded-md transition-all duration-200 ease-in-out",
                        item.active 
                          ? "bg-blue-50 dark:bg-blue-900/20 text-primary font-medium" 
                          : "hover:bg-blue-50 dark:hover:bg-blue-900/10"
                      )}
                    >
                      <Link to={item.path} className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm",
                        collapsed ? "justify-center" : "justify-start"
                      )}>
                        <item.icon size={18} />
                        {!collapsed && <span className="font-medium">{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                </Tooltip>
              </SidebarMenuItem>
            ))}
            
            {/* Logout Button */}
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 ease-in-out"
                  >
                    <button 
                      onClick={logout} 
                      disabled={isLoading}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm w-full",
                        collapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      <LogOut size={18} />
                      {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </TooltipProvider>
      
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
