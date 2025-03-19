
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Flag,
  BarChart3,
  Sparkles,
  Settings,
  CreditCard,
  Users,
  ChevronDown,
  ChevronRight,
  Plus,
  Link2,
  Coins
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  collapsed?: boolean;
  onClick?: () => void;
  rightContent?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  active, 
  href, 
  collapsed, 
  onClick,
  rightContent
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(href);
    }
  };
  
  return (
    <button
      className={`w-full flex items-center justify-start gap-3 mb-1 h-10 px-3 rounded-md text-sm
        ${active 
          ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30" 
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        }
      `}
      onClick={handleClick}
    >
      {icon}
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {rightContent}
        </>
      )}
    </button>
  );
};

interface SubMenuProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  children: React.ReactNode;
}

const SubMenu: React.FC<SubMenuProps> = ({ 
  icon, 
  label, 
  active, 
  collapsed, 
  children 
}) => {
  const [isOpen, setIsOpen] = React.useState(active);
  
  if (collapsed) {
    return (
      <div className="mb-1">
        <div className={`flex items-center justify-center h-10 px-3 rounded-md text-sm
          ${active 
            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
            : "text-muted-foreground"
          }
        `}>
          {icon}
        </div>
      </div>
    );
  }
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-1">
      <CollapsibleTrigger className={`w-full flex items-center justify-between gap-3 h-10 px-3 rounded-md text-sm
        ${active 
          ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30" 
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        }
      `}>
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-9 pr-2 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface SidebarNavigationProps {
  collapsed: boolean;
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  collapsed, 
  activePage = "dashboard" 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  
  useEffect(() => {
    if (user?.credits) {
      setCredits(user.credits);
    }
  }, [user]);
  
  const isPathActive = (path: string) => currentPath.startsWith(path);
  
  const CreditsDisplay = () => (
    <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
      <Coins size={14} />
      <span>{credits}</span>
    </div>
  );
  
  return (
    <nav className="space-y-1 flex-1">
      <NavItem 
        icon={<LayoutDashboard size={20} />} 
        label="Dashboard" 
        active={activePage === "dashboard"} 
        href="/dashboard" 
        collapsed={collapsed}
      />
      
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center my-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                  <Coins size={16} />
                  <span>{credits}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Available Credits</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex justify-between items-center px-3 py-2 mb-1">
          <span className="text-sm text-muted-foreground">Credits</span>
          <CreditsDisplay />
        </div>
      )}
      
      <SubMenu
        icon={<Flag size={20} />}
        label="Campaigns"
        active={isPathActive("/campaigns") || isPathActive("/create-campaign")}
        collapsed={collapsed}
      >
        <NavItem
          icon={<ChevronRight size={16} />}
          label="Manage Campaigns"
          active={activePage === "campaigns"}
          href="/campaigns"
          collapsed={collapsed}
        />
        <NavItem
          icon={<Plus size={16} />}
          label="Create Campaign"
          active={activePage === "create-campaign"}
          href="/create-campaign"
          collapsed={collapsed}
        />
      </SubMenu>
      
      <SubMenu
        icon={<BarChart3 size={20} />}
        label="Analytics"
        active={isPathActive("/analytics") || isPathActive("/insights") || isPathActive("/ai-insights")}
        collapsed={collapsed}
      >
        <NavItem
          icon={<ChevronRight size={16} />}
          label="AI Insights"
          active={activePage === "ai-insights" || activePage === "insights"}
          href="/insights"
          collapsed={collapsed}
        />
      </SubMenu>
      
      <SubMenu
        icon={<Settings size={20} />}
        label="Settings"
        active={isPathActive("/settings") || isPathActive("/billing") || isPathActive("/roles") || isPathActive("/config")}
        collapsed={collapsed}
      >
        <NavItem
          icon={<CreditCard size={16} />}
          label="Billing"
          active={activePage === "billing"}
          href="/billing"
          collapsed={collapsed}
        />
        <NavItem
          icon={<Users size={16} />}
          label="User Roles"
          active={activePage === "roles"}
          href="/settings/roles"
          collapsed={collapsed}
        />
        <NavItem
          icon={<Link2 size={16} />}
          label="Connections"
          active={activePage === "config"}
          href="/config"
          collapsed={collapsed}
        />
      </SubMenu>
    </nav>
  );
};

export default SidebarNavigation;
