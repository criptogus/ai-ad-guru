
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import { ensureStorageBucketsExist } from './integrations/supabase/storage';
import { ImageIcon } from "lucide-react";

// Import the new prompt template page
import PromptTemplatePage from './pages/PromptTemplatePage';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return user ? <>{children}</> : null;
};

const NavigationItem = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => {
  return (
    <NavigationMenuItem>
      <Button asChild variant="ghost" className="data-[active=true]:bg-muted focus:bg-secondary" data-active={active ? "true" : undefined}>
        <a href={to} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none focus:shadow-sm">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium leading-none">{label}</span>
          </div>
        </a>
      </Button>
    </NavigationMenuItem>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>Dashboard</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/campaigns",
    element: (
      <ProtectedRoute>
        <div>Campaigns</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-campaign",
    element: (
      <ProtectedRoute>
        <div>Create Campaign</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/assets",
    element: (
      <ProtectedRoute>
        <div>Assets</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <div>Settings</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <div>Login</div>,
  },
  {
    path: "/register",
    element: <div>Register</div>,
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <div>Team</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/integrations",
    element: (
      <ProtectedRoute>
        <div>Integrations</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/testing/linkedin",
    element: (
      <ProtectedRoute>
        <div>LinkedIn Ad Testing</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/smart-banner",
    element: (
      <ProtectedRoute>
        <div>Smart Banner Builder</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/prompt-templates",
    element: (
      <ProtectedRoute>
        <PromptTemplatePage />
      </ProtectedRoute>
    ),
  },
]);

export default App;
