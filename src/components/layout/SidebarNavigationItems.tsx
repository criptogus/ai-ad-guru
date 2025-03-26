import React from "react";
import { useLocation } from "react-router-dom";
import { Home, LayoutDashboard, Users, Settings, PlusCircle, FileImageIcon } from "lucide-react";
import { NavigationItem } from "@/components/layout/NavigationItem";
import { ImageIcon } from "lucide-react";

export const SidebarNavigationItems = () => {
  const location = useLocation();
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="space-y-1">
      <NavigationItem
        to="/"
        icon={<Home className="h-4 w-4" />}
        label="Home"
        active={isActivePath("/")}
      />
      <NavigationItem
        to="/campaigns"
        icon={<LayoutDashboard className="h-4 w-4" />}
        label="Campaigns"
        active={isActivePath("/campaigns")}
      />
      <NavigationItem
        to="/create-campaign"
        icon={<PlusCircle className="h-4 w-4" />}
        label="Create Campaign"
        active={isActivePath("/create-campaign")}
      />
      <NavigationItem
        to="/assets"
        icon={<FileImageIcon className="h-4 w-4" />}
        label="Assets"
        active={isActivePath("/assets")}
      />
      <NavigationItem
        to="/team"
        icon={<Users className="h-4 w-4" />}
        label="Team"
        active={isActivePath("/team")}
      />
      
      <h2 className="mb-2 mt-6 px-4 text-lg font-semibold tracking-tight">
        Tools
      </h2>
      
      <NavigationItem
        to="/prompt-templates"
        icon={<ImageIcon className="h-4 w-4" />}
        label="GPT-4o Image Generator"
        active={isActivePath("/prompt-templates")}
      />
      
      <h2 className="mb-2 mt-6 px-4 text-lg font-semibold tracking-tight">
        Settings
      </h2>
      <NavigationItem
        to="/settings"
        icon={<Settings className="h-4 w-4" />}
        label="Settings"
        active={isActivePath("/settings")}
      />
    </div>
  );
};
