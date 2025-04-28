import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "@/components/layout/NavigationItem";
import {
  LayoutDashboard,
  ClipboardList,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface SidebarNavigationProps {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onClose: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isOpen,
  isCollapsed,
  toggleCollapse,
  onClose
}) => {
  const location = useLocation();
  const { t, currentLanguage } = useLanguage();
  const [, setRenderKey] = useState(0);
  
  useEffect(() => {
    console.log("SidebarNavigation - Language changed to:", currentLanguage);
    setRenderKey(prevKey => prevKey + 1);
  }, [currentLanguage]);

  const navigationItems = [
    { title: t('nav.home'), icon: Home, href: "/" },
    { title: t('nav.dashboard'), icon: LayoutDashboard, href: "/dashboard" },
    { title: t('nav.campaigns'), icon: ClipboardList, href: "/campaigns" },
    { title: t('nav.connections'), icon: Share2, href: "/connections" },
    { title: t('nav.adManager'), icon: BarChart3, href: "/ad-manager" },
    { title: t('nav.settings'), icon: Settings, href: "/settings" }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-white dark:bg-[#1A1F2C] border-r shadow-sm transition-all duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full",
      isCollapsed ? "w-16" : "w-64",
      "md:translate-x-0",
      "dark:border-gray-800"
    )}>
      <div className="flex items-center justify-between px-4 py-4 h-16 border-b dark:border-gray-800">
        {!isCollapsed && <span className="font-bold text-primary">Zero Manager</span>}
        <button 
          onClick={toggleCollapse} 
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <button 
          onClick={onClose} 
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <nav className="space-y-1 mt-4 px-2">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.title}
            to={item.href}
            icon={<item.icon className="w-5 h-5" />}
            label={item.title}
            active={isActive(item.href)}
            collapsed={isCollapsed}
            onClick={onClose}
          />
        ))}
      </nav>

      {!isCollapsed && <LanguageSwitcher />}

      {!isCollapsed && (
        <div className="absolute bottom-0 w-full text-xs p-4 text-muted-foreground border-t dark:border-gray-800">
          © {new Date().getFullYear()} Zero Ad Manager
        </div>
      )}
    </aside>
  );
};

export default SidebarNavigation;
