import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import PromptTemplatePage from './pages/PromptTemplatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import TestAdsPage from './pages/TestAdsPage';

// Define auth layout
const AuthLayout = () => {
  return <Outlet />;
};

// Define layout routes
const AppLayout = () => {
  return <Outlet />;
};

// Define the router configuration
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
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "campaigns",
        element: (
          <ProtectedRoute>
            <CampaignsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-campaign",
        element: (
          <ProtectedRoute>
            <CreateCampaignPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "test-ads",
        element: (
          <ProtectedRoute>
            <TestAdsPage />
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
      {
        path: "billing",
        element: (
          <ProtectedRoute>
            <div>Billing</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <div>Profile</div>
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
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />
  },
  {
    path: "/register",
    element: <Navigate to="/auth/register" replace />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
