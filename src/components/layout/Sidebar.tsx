import React from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarCollapseButton from "./SidebarCollapseButton";
import SidebarNavigation from "../navigation/SidebarNavigation";
import CreateCampaignButton from "./CreateCampaignButton";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCreditCosts } from "@/services/credits/creditCosts";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { user } = useAuth();
  const credits = user?.credits || 0;
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "relative h-screen bg-background border-r p-2 sm:p-3 flex flex-col transition-all duration-300 ease-in-out z-10",
      collapsed ? "w-[60px] sm:w-[68px]" : "w-[240px]"
    )}>
      <SidebarCollapseButton 
        collapsed={collapsed} 
        onClick={() => setCollapsed(!collapsed)} 
      />

      <SidebarHeader collapsed={collapsed} />

      <div className={cn(
        "mb-4 px-1 sm:px-2 py-2 border rounded-lg text-center bg-purple-50 dark:bg-purple-900/20 transition-all",
        collapsed ? "mx-0 p-1 sm:p-2" : "mx-1"
      )}>
        {collapsed ? (
          <div className="text-center font-semibold text-purple-700 dark:text-purple-300">
            {credits}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{credits}</span>
            </div>
          </div>
        )}
      </div>

      <SidebarNavigation collapsed={collapsed} activePage={activePage} />

      <CreateCampaignButton collapsed={collapsed} />

      <div className="border-t pt-3">
        <ThemeToggle />
        <ProfileDropdown collapsed={collapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
