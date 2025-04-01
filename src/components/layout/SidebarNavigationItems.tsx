
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
  Layers,
  LogOut
} from "lucide-react";
import { useLogoutAction } from "@/hooks/auth/useLogoutAction";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { logout, isLoading } = useLogoutAction(setUser, navigate);

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
      href: "/roles",
      icon: Users,
      active: activePage === "team" || activePage === "roles" || currentPath === "/team" || currentPath === "/roles"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: activePage === "settings" || currentPath.includes("/settings")
    }
  ];

  return (
    <div className="space-y-1 flex flex-col h-full">
      <div className="flex-1">
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
      
      {/* Logout Button */}
      <button
        onClick={logout}
        disabled={isLoading}
        className={cn(
          "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors mt-auto",
          "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        )}
        title="Logout"
      >
        <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default SidebarNavigationItems;
