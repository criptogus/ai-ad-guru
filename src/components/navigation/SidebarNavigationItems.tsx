
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { NavigationItem } from "../ui/sidebar";
import {
  Home,
  LineChart,
  Settings,
  CreditCard,
  Megaphone,
  Lightbulb,
  Users,
  LayoutTemplate,
  SlidersHorizontal,
  FileText,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const SidebarNavigationItems: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isActiveRoute = (route: string) => pathname === route;

  return (
    <div className="space-y-1 py-2">
      <NavigationItem
        to="/dashboard"
        active={isActiveRoute("/dashboard")}
        icon={<Home className="h-4 w-4" />}
        label="Dashboard"
      />
      <NavigationItem
        to="/campaigns"
        active={isActiveRoute("/campaigns")}
        icon={<Megaphone className="h-4 w-4" />}
        label="Campaigns"
      />
      <NavigationItem
        to="/smart-banner"
        active={isActiveRoute("/smart-banner")}
        icon={<Wand2 className="h-4 w-4" />}
        label="Smart Banner Builder"
        badge="Beta"
      />
      <NavigationItem
        to="/analytics"
        active={isActiveRoute("/analytics")}
        icon={<LineChart className="h-4 w-4" />}
        label="Analytics"
      />
      <NavigationItem
        to="/config"
        active={isActiveRoute("/config")}
        icon={<Settings className="h-4 w-4" />}
        label="Account Setup"
      />
      <NavigationItem
        to="/billing"
        active={isActiveRoute("/billing")}
        icon={<CreditCard className="h-4 w-4" />}
        label="Billing"
      />
      <NavigationItem
        to="/ai-insights"
        active={isActiveRoute("/ai-insights")}
        icon={<Lightbulb className="h-4 w-4" />}
        label="AI Insights"
      />
      {user?.role === "admin" && (
        <NavigationItem
          to="/user-roles"
          active={isActiveRoute("/user-roles")}
          icon={<Users className="h-4 w-4" />}
          label="User Roles"
        />
      )}
      {user?.role === "admin" && (
        <NavigationItem
          to="/test-ads"
          active={isActiveRoute("/test-ads")}
          icon={<LayoutTemplate className="h-4 w-4" />}
          label="Test Ads"
        />
      )}
      {user?.role === "admin" && (
        <NavigationItem
          to="/openai-test"
          active={isActiveRoute("/openai-test")}
          icon={<SlidersHorizontal className="h-4 w-4" />}
          label="OpenAI Test"
        />
      )}
    </div>
  );
};
