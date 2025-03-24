
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge
} from "../ui/sidebar";
import {
  Home,
  LineChart,
  Settings,
  CreditCard,
  Megaphone,
  Users,
  LayoutTemplate,
  SlidersHorizontal,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationItemProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  to,
  active,
  icon,
  label,
  badge
}) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={label}
      >
        <Link to={to} className="flex items-center">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-4 w-4", 
            size: isMobile ? 16 : 18 
          })}
          <span className="ml-3 text-xs sm:text-sm">{label}</span>
        </Link>
      </SidebarMenuButton>
      {badge && (
        <SidebarMenuBadge className="bg-purple-100 text-purple-800 text-xs dark:bg-purple-900 dark:text-purple-100">
          {badge}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
};

export const SidebarNavigationItems: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isActiveRoute = (route: string) => {
    // Check if the route is exactly matched or is a sub-route
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  return (
    <div className="space-y-1 py-2">
      <NavigationItem
        to="/dashboard"
        active={isActiveRoute("/dashboard")}
        icon={<Home />}
        label="Dashboard"
      />
      <NavigationItem
        to="/campaigns"
        active={isActiveRoute("/campaigns")}
        icon={<Megaphone />}
        label="Campaigns"
      />
      <NavigationItem
        to="/smart-banner"
        active={isActiveRoute("/smart-banner")}
        icon={<Wand2 />}
        label="Smart Banner Builder"
        badge="Beta"
      />
      <NavigationItem
        to="/analytics"
        active={isActiveRoute("/analytics")}
        icon={<LineChart />}
        label="Analytics"
      />
      <NavigationItem
        to="/config"
        active={isActiveRoute("/config")}
        icon={<Settings />}
        label="Account Setup"
      />
      <NavigationItem
        to="/billing"
        active={isActiveRoute("/billing")}
        icon={<CreditCard />}
        label="Billing"
      />
      {user?.role === "admin" && (
        <NavigationItem
          to="/user-roles"
          active={isActiveRoute("/user-roles")}
          icon={<Users />}
          label="User Roles"
        />
      )}
      {user?.role === "admin" && (
        <NavigationItem
          to="/test-ads"
          active={isActiveRoute("/test-ads")}
          icon={<LayoutTemplate />}
          label="Test Ads"
        />
      )}
      {user?.role === "admin" && (
        <NavigationItem
          to="/openai-test"
          active={isActiveRoute("/openai-test")}
          icon={<SlidersHorizontal />}
          label="OpenAI Test"
        />
      )}
    </div>
  );
};
