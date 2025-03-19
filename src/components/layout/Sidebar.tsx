
import React from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarCollapseButton from "./SidebarCollapseButton";
import SidebarNavigation from "../navigation/SidebarNavigation";
import CreateCampaignButton from "./CreateCampaignButton";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  activePage = "dashboard" 
}) => {
  return (
    <div className={cn(
      "relative h-screen bg-background border-r p-3 flex flex-col transition-all duration-300 ease-in-out",
      collapsed ? "w-[68px]" : "w-[240px]"
    )}>
      {/* Collapse button */}
      <SidebarCollapseButton 
        collapsed={collapsed} 
        onClick={() => setCollapsed(!collapsed)} 
      />

      {/* Logo */}
      <SidebarHeader collapsed={collapsed} />

      {/* Navigation */}
      <SidebarNavigation collapsed={collapsed} activePage={activePage} />

      {/* Create Button */}
      <CreateCampaignButton collapsed={collapsed} />

      {/* Theme Toggle & User Profile */}
      <div className="border-t pt-3">
        <ThemeToggle />
        <ProfileDropdown collapsed={collapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
