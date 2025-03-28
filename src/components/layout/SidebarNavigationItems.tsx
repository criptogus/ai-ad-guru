
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Home,
  Settings,
  CreditCard,
  Users,
  FileText,
  ArrowRightLeft,
  Layers
} from "lucide-react";

interface SidebarNavigationItemsProps {
  activePage?: string;
  collapsed?: boolean;
}

const SidebarNavigationItems: React.FC<SidebarNavigationItemsProps> = ({ 
  activePage = "dashboard", 
  collapsed = false 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: activePage === "dashboard" || currentPath === "/dashboard"
    },
    {
      name: "Campaigns",
      href: "/campaigns",
      icon: Layers,
      active: activePage === "campaigns" || currentPath.includes("/campaigns")
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      active: activePage === "analytics" || currentPath === "/analytics"
    },
    {
      name: "Credits",
      href: "/credits-info",
      icon: CreditCard,
      active: activePage === "credits" || currentPath.includes("/credits")
    },
    {
      name: "Connections",
      href: "/connections",
      icon: ArrowRightLeft,
      active: activePage === "connections" || currentPath === "/connections"
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      active: activePage === "team" || currentPath === "/team"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: activePage === "settings" || currentPath === "/settings"
    }
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
            item.active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
          {!collapsed && <span>{item.name}</span>}
        </Link>
      ))}
    </div>
  );
};

export default SidebarNavigationItems;
