
import React from "react";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "@/components/layout/NavigationItem";
import SidebarNavigationItems from "./SidebarNavigationItems";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";

export const SidebarNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {SidebarNavigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <NavigationItem
                to={item.href}
                icon={<item.icon className="w-5 h-5" />}
                label={item.title}
                active={isActive(item.href)}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNavigation;
