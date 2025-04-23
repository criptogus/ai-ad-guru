
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  to,
  icon,
  label,
  active = false,
  collapsed = false,
  onClick
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
        active 
          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground" 
          : "text-foreground/70 hover:bg-muted dark:text-muted-foreground dark:hover:bg-gray-800/50 dark:hover:text-foreground",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <span className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5")}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};
