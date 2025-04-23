import React from "react";
import { LucideIcon } from "lucide-react";
import { Home, LayoutDashboard, Users, Settings, FileText } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isNew?: boolean;
}

const SidebarNavigationItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campanhas",
    href: "/campaigns",
    icon: <LucideIcon name="FileText" />,
  },
  {
    title: "Conexões",
    href: "/connections",
    icon: Users,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
  // Add a new item for the Ad Manager
  {
    title: "Gerenciador de Anúncios",
    href: "/ad-manager",
    icon: <LucideIcon name="FileText" />,
    isNew: true,
  },
];

export default SidebarNavigationItems;
