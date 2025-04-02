
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
  LogOut,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoutAction } from '@/hooks/auth/useLogoutAction';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface SidebarNavigationItemsProps {
  collapsed?: boolean;
  activePage?: string;
}

const SidebarNavigationItems: React.FC<SidebarNavigationItemsProps> = ({ collapsed, activePage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { logout, isLoading } = useLogoutAction(setUser, navigate);

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
      name: 'Connections',
      icon: ArrowRightLeft,
      path: '/connections',
      active: currentPath.includes('/connections') || activePage === 'connections',
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
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.name} className="relative group">
          <Link 
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
              item.active 
                ? "bg-blue-50 dark:bg-blue-900/20 text-primary font-medium" 
                : "hover:bg-blue-50 dark:hover:bg-blue-900/10",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <item.icon size={18} />
            {!collapsed && <span className="font-medium truncate">{item.name}</span>}
            {collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="sr-only">{item.name}</span>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            )}
          </Link>
        </div>
      ))}
      
      {/* Logout Button */}
      <div className="relative group mt-4">
        <button 
          onClick={logout} 
          disabled={isLoading}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm w-full rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span className="font-medium">Logout</span>}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="sr-only">Logout</span>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          )}
        </button>
      </div>
    </div>
  );
};

export default SidebarNavigationItems;
