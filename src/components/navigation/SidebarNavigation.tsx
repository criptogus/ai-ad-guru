
import React from 'react';
import { SidebarNavigationItems } from './SidebarNavigationItems';
import { SidebarMenu } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  collapsed: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed, activePage }) => {
  return (
    <div className="flex-1 py-6">
      <nav className="space-y-1">
        <SidebarMenu>
          <SidebarNavigationItems collapsed={collapsed} activePage={activePage} />
        </SidebarMenu>
      </nav>
    </div>
  );
};

export default SidebarNavigation;
