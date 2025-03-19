
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
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

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
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/dashboard"
          tooltip="Dashboard"
          isActive={isActive("/dashboard")}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/campaigns"
          tooltip="Campaigns"
          isActive={isActive("/campaigns")}
        >
          <Megaphone className="h-5 w-5" />
          <span>Campaigns</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/analytics"
          tooltip="Analytics"
          isActive={isActive("/analytics")}
        >
          <BarChart className="h-5 w-5" />
          <span>Analytics</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/insights"
          tooltip="AI Insights"
          isActive={isActive("/insights")}
        >
          <Sparkles className="h-5 w-5" />
          <span>AI Insights</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/config"
          tooltip="Connections"
          isActive={isActive("/config")}
        >
          <Cog className="h-5 w-5" />
          <span>Connections</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/billing"
          tooltip="Billing"
          isActive={isActive("/billing")}
        >
          <CreditCard className="h-5 w-5" />
          <span>Billing</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/users"
          tooltip="Users & Roles"
          isActive={isActive("/users")}
        >
          <Users className="h-5 w-5" />
          <span>Users & Roles</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {process.env.NODE_ENV !== 'production' && (
        <SidebarMenuItem>
          <SidebarMenuButton
            href="/test-ads"
            tooltip="Test Ads"
            isActive={isActive("/test-ads")}
          >
            <BugPlay className="h-5 w-5" />
            <span>Test Ads</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
