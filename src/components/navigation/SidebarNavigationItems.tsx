
import React from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Cog,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Users,
  Sparkles,
  BugPlay
} from "lucide-react";
import { SidebarItem } from "@/components/ui/sidebar";

export function SidebarNavigationItems() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      <SidebarItem
        href="/dashboard"
        icon={LayoutDashboard}
        text="Dashboard"
        active={isActive("/dashboard")}
      />
      <SidebarItem
        href="/campaigns"
        icon={Megaphone}
        text="Campaigns"
        active={isActive("/campaigns")}
      />
      <SidebarItem
        href="/analytics"
        icon={BarChart}
        text="Analytics"
        active={isActive("/analytics")}
      />
      <SidebarItem
        href="/insights"
        icon={Sparkles}
        text="AI Insights"
        active={isActive("/insights")}
      />
      <SidebarItem
        href="/config"
        icon={Cog}
        text="Connections"
        active={isActive("/config")}
      />
      <SidebarItem
        href="/billing"
        icon={CreditCard}
        text="Billing"
        active={isActive("/billing")}
      />
      <SidebarItem
        href="/users"
        icon={Users}
        text="Users & Roles"
        active={isActive("/users")}
      />
      {process.env.NODE_ENV !== 'production' && (
        <SidebarItem
          href="/test-ads"
          icon={BugPlay}
          text="Test Ads"
          active={isActive("/test-ads")}
        />
      )}
    </>
  );
}
