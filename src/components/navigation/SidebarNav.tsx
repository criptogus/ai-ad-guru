
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Users,
  BarChart3,
  Megaphone,
  ListTodo,
  ImageIcon,
  PanelLeftClose,
  Wrench
} from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

export function SidebarNav({ className, collapsed = false, ...props }: SidebarNavProps) {
  const location = useLocation();
  
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Campaigns",
      href: "/campaigns",
      icon: Megaphone,
    },
    {
      title: "Create Campaign",
      href: "/create-campaign",
      icon: ListTodo,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Ad Accounts",
      href: "/ad-accounts",
      icon: Users,
    },
    {
      title: "Tools",
      items: [
        {
          title: "Prompt Templates",
          href: "/tools/templates",
          icon: ImageIcon,
        },
        {
          title: "Meta Ad Generator",
          href: "/tools/meta-ad-generator",
          icon: ImageIcon,
        }
      ],
      icon: Wrench,
    },
    {
      title: "Billing",
      href: "/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    }
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item, index) => {
        if (item.items) {
          // This is a group with sub-items
          return (
            <div key={index} className="space-y-1">
              <div className={cn(
                collapsed ? "justify-center" : "px-3 py-2",
                "flex items-center text-muted-foreground text-sm font-medium"
              )}>
                {item.icon && <item.icon className="h-4 w-4" />}
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </div>
              <div className={collapsed ? "" : "pl-3"}>
                {item.items.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: collapsed ? "icon" : "sm" }),
                      location.pathname === subItem.href
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-transparent hover:underline",
                      "justify-start w-full",
                      collapsed && "h-9 w-9"
                    )}
                  >
                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                    {!collapsed && <span className="ml-2">{subItem.title}</span>}
                  </Link>
                ))}
              </div>
            </div>
          );
        }
        
        // This is a regular item
        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: collapsed ? "icon" : "sm" }),
              location.pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start w-full",
              collapsed && "h-9 w-9"
            )}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {!collapsed && <span className="ml-2">{item.title}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
