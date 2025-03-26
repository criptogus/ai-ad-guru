
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import PromptTemplatePage from './pages/PromptTemplatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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

// Define layout routes
const AppLayout = () => {
  return <Outlet />;
};

// Define auth layout
const AuthLayout = () => {
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "campaigns",
        element: (
          <ProtectedRoute>
            <div>Campaigns</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "create-campaign",
        element: (
          <ProtectedRoute>
            <div>Create Campaign</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "assets",
        element: (
          <ProtectedRoute>
            <div>Assets</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <div>Settings</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "team",
        element: (
          <ProtectedRoute>
            <div>Team</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "integrations",
        element: (
          <ProtectedRoute>
            <div>Integrations</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "testing/linkedin",
        element: (
          <ProtectedRoute>
            <div>LinkedIn Ad Testing</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "smart-banner",
        element: (
          <ProtectedRoute>
            <div>Smart Banner Builder</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "prompt-templates",
        element: (
          <ProtectedRoute>
            <PromptTemplatePage />
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      }
    ]
  },
  // Redirect old login/register routes to new ones
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />
  },
  {
    path: "/register",
    element: <Navigate to="/auth/register" replace />
  }
]);

export default App;
