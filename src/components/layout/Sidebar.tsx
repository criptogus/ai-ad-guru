import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { useSidebar } from "@/hooks/useSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreditsHeaderDisplay from "./CreditsHeaderDisplay";

// Update the CreateCampaignButton props interface to include collapsed
interface CreateCampaignButtonProps {
  collapsed: boolean;
}

// Make sure CreateCampaignButton component accepts collapsed prop
const CreateCampaignButton: React.FC<CreateCampaignButtonProps> = ({ collapsed }) => {
  return (
    <Button asChild variant="secondary" className="w-full justify-start">
      <Link to="/create-campaign">
        <span className="w-full">
          {collapsed ? 'New' : 'Create New Campaign'}
        </span>
      </Link>
    </Button>
  );
};

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="mr-2 px-0 lg:hidden"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 border-r p-0">
          <SidebarContent collapsed={collapsed} />
        </SheetContent>
      </Sheet>
      <div className="flex-1">{children}</div>
    </div>
  );
};

interface SidebarContentProps {
  collapsed: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <SheetHeader className="px-10 pt-10 pb-6">
        <SheetTitle>AI Ad Guru</SheetTitle>
        <SheetDescription>
          {collapsed ? 'Menu' : 'Manage your account and preferences'}
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="py-4">
          <div className="px-3 py-2">
            <CreateCampaignButton collapsed={collapsed} />
          </div>
          <SidebarNavItem
            collapsed={collapsed}
            to="/dashboard"
            icon="home"
            label="Dashboard"
          />
          <SidebarNavItem
            collapsed={collapsed}
            to="/campaigns"
            icon="layout"
            label="Campaigns"
          />
          <SidebarNavItem
            collapsed={collapsed}
            to="/smart-banner"
            icon="image"
            label="Smart Banner"
          />
          <SidebarNavItem
            collapsed={collapsed}
            to="/credits-info"
            icon="coins"
            label="Credits Info"
          />
          <SidebarNavItem
            collapsed={collapsed}
            to="/settings"
            icon="settings"
            label="Settings"
          />
        </div>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 w-80 border-t">
        <div className="flex items-center justify-between p-3">
          <CreditsHeaderDisplay />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate("/billing")}>
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

interface SidebarNavItemProps {
  collapsed: boolean;
  to: string;
  icon: string;
  label: string;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  collapsed,
  to,
  icon,
  label,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-md p-2 text-sm font-semibold ${
          isActive
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`
      }
    >
      <i className={`lucide lucide-${icon} h-4 w-4`} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

import { useNavigate } from 'react-router-dom';

export default Sidebar;
