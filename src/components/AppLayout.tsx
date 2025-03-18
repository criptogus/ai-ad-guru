
import React from "react";
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
  Home,
  Layout,
  PieChart
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

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, href }) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 pl-2",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => navigate(href)}
    >
      {icon}
      <span>{label}</span>
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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r p-4 flex flex-col">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold">
            AG
          </div>
          <h1 className="text-xl font-bold">AI Ad Guru</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          <NavItem 
            icon={<Home size={18} />} 
            label="Dashboard" 
            active={activePage === "dashboard"} 
            href="/dashboard" 
          />
          <NavItem 
            icon={<Layout size={18} />} 
            label="Campaigns" 
            active={activePage === "campaigns"} 
            href="/campaigns" 
          />
          <NavItem 
            icon={<BarChart3 size={18} />} 
            label="Analytics" 
            active={activePage === "analytics"}
            href="/analytics" 
          />
          <NavItem 
            icon={<PieChart size={18} />} 
            label="Performance" 
            active={activePage === "performance"}
            href="/performance" 
          />
          <NavItem 
            icon={<CreditCard size={18} />} 
            label="Billing" 
            active={activePage === "billing"}
            href="/billing" 
          />
        </nav>

        {/* Create Button */}
        <Button 
          className="w-full my-4 gap-2" 
          onClick={() => navigate("/create-campaign")}
        >
          <PlusCircle size={18} />
          <span>Create Campaign</span>
        </Button>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 w-full flex items-center gap-2 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.credits} credits</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
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
