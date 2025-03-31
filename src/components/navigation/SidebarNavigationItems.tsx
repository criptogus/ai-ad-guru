
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart,
  Settings, 
  Users,
  CreditCard,
  Megaphone,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarNavigationItemsProps {
  collapsed?: boolean;
  activePage?: string;
}

export const SidebarNavigationItems: React.FC<SidebarNavigationItemsProps> = ({ collapsed, activePage }) => {
  const location = useLocation();
  const currentPath = location.pathname;

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
      name: 'Team',
      icon: Users,
      path: '/roles',
      active: currentPath.includes('/roles') || activePage === 'team' || activePage === 'roles',
    },
    {
      name: 'Billing',
      icon: CreditCard,
      path: '/billing',
      active: currentPath.includes('/billing') || activePage === 'billing',
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
    <>
      {items.map((item) => (
        <Link 
          key={item.name} 
          to={item.path} 
          className={cn(
            "flex items-center px-2 py-2 rounded-md transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            item.active ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-600 dark:text-gray-400",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-gray-500 dark:text-gray-400")} />
          {!collapsed && <span className="ml-3">{item.name}</span>}
        </Link>
      ))}
    </>
  );
};

