
import React from "react";
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText,
  TargetIcon,
  BarChart3
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
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
    icon: FileText,
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
  {
    title: "Gerenciador de Anúncios",
    href: "/ad-manager",
    icon: BarChart3,
    isNew: true,
  },
];

export default SidebarNavigationItems;
