
import React from "react";
import { useLocation, Link } from "react-router-dom";
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
import { cn } from "@/lib/utils";

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

  const linkClasses = "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted";
  const activeLinkClasses = "bg-muted font-medium";

  return (
    <div className="space-y-1">
      <Link 
        to="/dashboard" 
        className={cn(linkClasses, isActive("/dashboard") && activeLinkClasses)}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      
      <Link 
        to="/campaigns" 
        className={cn(linkClasses, isActive("/campaigns") && activeLinkClasses)}
      >
        <Megaphone className="h-5 w-5" />
        <span>Campaigns</span>
      </Link>
      
      <Link 
        to="/analytics" 
        className={cn(linkClasses, isActive("/analytics") && activeLinkClasses)}
      >
        <BarChart className="h-5 w-5" />
        <span>Analytics</span>
      </Link>
      
      <Link 
        to="/insights" 
        className={cn(linkClasses, isActive("/insights") && activeLinkClasses)}
      >
        <Sparkles className="h-5 w-5" />
        <span>AI Insights</span>
      </Link>
      
      <Link 
        to="/config" 
        className={cn(linkClasses, isActive("/config") && activeLinkClasses)}
      >
        <Cog className="h-5 w-5" />
        <span>Connections</span>
      </Link>
      
      <Link 
        to="/billing" 
        className={cn(linkClasses, isActive("/billing") && activeLinkClasses)}
      >
        <CreditCard className="h-5 w-5" />
        <span>Billing</span>
      </Link>
      
      <Link 
        to="/users" 
        className={cn(linkClasses, isActive("/users") && activeLinkClasses)}
      >
        <Users className="h-5 w-5" />
        <span>Users & Roles</span>
      </Link>
      
      {process.env.NODE_ENV !== 'production' && (
        <Link 
          to="/test-ads" 
          className={cn(linkClasses, isActive("/test-ads") && activeLinkClasses)}
        >
          <BugPlay className="h-5 w-5" />
          <span>Test Ads</span>
        </Link>
      )}
    </div>
  );
}
