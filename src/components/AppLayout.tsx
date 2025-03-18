
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  PlusCircle, 
  CreditCard, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Flag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, href, collapsed }) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 mb-1 h-10 px-3",
        active 
          ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30" 
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
      onClick={() => navigate(href)}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Button>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage = "dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "relative h-screen bg-background border-r p-3 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}>
        {/* Collapse button */}
        <button 
          className="absolute -right-3 top-12 rounded-full bg-blue-600 text-white p-1 shadow-md hover:bg-blue-700 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo */}
        <div className={cn("mb-6 flex items-center", collapsed ? "justify-center" : "gap-2")}>
          <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
            AG
          </div>
          {!collapsed && <h1 className="text-lg font-medium">Ad Manager</h1>}
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activePage === "dashboard"} 
            href="/dashboard" 
            collapsed={collapsed}
          />
          <NavItem 
            icon={<Flag size={20} />} 
            label="Campaigns" 
            active={activePage === "campaigns"} 
            href="/campaigns" 
            collapsed={collapsed}
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activePage === "analytics"}
            href="/analytics" 
            collapsed={collapsed}
          />
          <NavItem 
            icon={<Sparkles size={20} />} 
            label="AI Insights" 
            active={activePage === "insights"}
            href="/insights" 
            collapsed={collapsed}
          />
          <NavItem 
            icon={<CreditCard size={20} />} 
            label="Billing" 
            active={activePage === "billing"}
            href="/billing" 
            collapsed={collapsed}
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activePage === "settings"}
            href="/settings" 
            collapsed={collapsed}
          />
        </nav>

        {/* Create Button */}
        <Button 
          className={cn(
            "my-4 gap-2 bg-blue-600 hover:bg-blue-700", 
            collapsed ? "px-2 aspect-square" : "w-full"
          )} 
          onClick={() => navigate("/create-campaign")}
        >
          <PlusCircle size={collapsed ? 20 : 16} />
          {!collapsed && <span>Create</span>}
        </Button>

        {/* Theme Toggle & User Profile */}
        <div className="border-t pt-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="mb-3 mx-auto block"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("p-2 flex items-center gap-2 w-full", 
                  collapsed ? "justify-center" : "justify-start")}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings size={16} className="mr-2" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/billing")}>
                  <CreditCard size={16} className="mr-2" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
