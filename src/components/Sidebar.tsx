
import {
  LayoutDashboard,
  ClipboardList,
  Share2,
  Layers,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import React from "react";

const menuItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Campanhas", icon: ClipboardList, path: "/campaigns" },
  { name: "Conexões", icon: Share2, path: "/connections" },
  { name: "Gerenciador de Anúncios", icon: BarChart3, path: "/ad-manager" },
  { name: "Configurações", icon: Settings, path: "/settings" },
];

export const Sidebar = ({
  isOpen,
  isCollapsed,
  toggleCollapse,
  onClose
}: {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onClose: () => void;
}) => {
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full bg-white border-r shadow-sm z-50 transition-all duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full",
      isCollapsed ? "w-16" : "w-64",
      "md:translate-x-0 md:static md:block",
      "dark:bg-[#1A1F2C] dark:border-gray-800"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-800">
        {!isCollapsed && <span className="font-bold text-blue-600 dark:text-primary">Zero Manager</span>}
        <button onClick={toggleCollapse} className="md:inline-block hidden">
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <button onClick={onClose} className="md:hidden">
          ✕
        </button>
      </div>

      {/* Menu Items */}
      <nav className="space-y-1 mt-4">
        {menuItems.map(({ name, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              to={path}
              key={name}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-150",
                active ? "bg-blue-100 text-blue-700 dark:bg-secondary dark:text-primary" : "text-gray-700 dark:text-muted-foreground hover:bg-blue-50 dark:hover:bg-primary/5",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 w-full text-xs p-4 text-muted-foreground border-t dark:border-gray-800">
          © {new Date().getFullYear()} Zero Ad Manager
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
