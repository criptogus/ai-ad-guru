import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import SettingsPage from "./pages/SettingsPage";
import ConfigPage from "./pages/ConfigPage";
import CreditsInfoPage from "./pages/CreditsInfoPage";
import BillingPage from "./pages/BillingPage";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";

// Import the new BillingHistoryPage
import BillingHistoryPage from "@/pages/BillingHistoryPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <AppLayout>{children}</AppLayout> : null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authentication />,
  },
  {
    path: "/auth",
    element: <Authentication />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/campaigns",
    element: (
      <ProtectedRoute>
        <CampaignsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-campaign",
    element: (
      <ProtectedRoute>
        <CreateCampaignPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/config",
    element: (
      <ProtectedRoute>
        <ConfigPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/credits",
    element: (
      <ProtectedRoute>
        <CreditsInfoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/billing",
    element: (
      <ProtectedRoute>
        <BillingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/billing/history",
    element: <BillingHistoryPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
