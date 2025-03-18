
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
        "w-full justify-start gap-3 pl-3 mb-1 h-11",
        active 
          ? "bg-primary/10 text-primary hover:bg-primary/20" 
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
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
        "relative h-screen bg-card border-r p-4 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}>
        {/* Collapse button */}
        <button 
          className="absolute -right-3 top-12 rounded-full bg-primary text-white p-1 shadow-md hover:bg-primary/90 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo */}
        <div className={cn("mb-8 flex items-center", collapsed ? "justify-center" : "gap-2")}>
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center font-bold">
            AG
          </div>
          {!collapsed && <h1 className="text-xl font-bold">AI Ad Guru</h1>}
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

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          className="my-2 mx-auto"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* Create Button */}
        <Button 
          className={cn("my-4 gap-2", collapsed ? "p-3 aspect-square" : "w-full")} 
          onClick={() => navigate("/create-campaign")}
        >
          <PlusCircle size={20} />
          {!collapsed && <span>Create Campaign</span>}
        </Button>

        {/* User Profile */}
        {user && (
          <div className={cn("flex items-center pt-4 border-t", collapsed ? "justify-center" : "gap-2")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("p-0 flex items-center gap-2 hover:bg-transparent", 
                  collapsed ? "justify-center w-10 h-10" : "justify-start w-full")}>
                  <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium line-clamp-1">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.credits} credits</p>
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
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
