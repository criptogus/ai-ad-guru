
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarNavigationItems } from './SidebarNavigationItems';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  collapsed: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed, activePage }) => {
  return (
    <div className="flex-1 py-6">
      <nav className="space-y-1">
        <SidebarNavigationItems />
      </nav>
    </div>
  );
};

export default SidebarNavigation;
