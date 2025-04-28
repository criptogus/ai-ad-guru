
import React, { lazy, Suspense } from 'react';
import {
  Route,
  Routes,
  Outlet,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useLocation
} from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';

// Loading component
const Loading = () => (
  <Card className="w-full h-full flex items-center justify-center">
    <CardContent className="p-12">
      <Loader className="h-8 w-8 animate-spin" />
      <p className="mt-2 text-center">Carregando...</p>
    </CardContent>
  </Card>
);

// Lazy load components
const HomePage = lazy(() => import('@/pages/HomePage'));
const Authentication = lazy(() => import('@/pages/Authentication'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const ConnectionsPage = lazy(() => import('@/pages/ConnectionsPage'));
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const AdManagerPage = lazy(() => import('@/pages/AdManagerPage'));
const OAuthCallbackHandler = lazy(() => import('@/components/config/OAuthCallbackHandler'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

// PublicRoute component to restrict access to authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

// Define the routes configuration
const routes = [
  {
    path: "/",
    element: <Outlet />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/pricing", element: <PricingPage /> },
      {
        path: "/auth",
        children: [
          { path: "login", element: <PublicRoute><Authentication /></PublicRoute> },
          { path: "register", element: <PublicRoute><Authentication /></PublicRoute> },
          { index: true, element: <Navigate to="/auth/login" replace /> },
        ],
      },
      { path: "/callback", element: <OAuthCallbackHandler /> },
      { 
        path: "/dashboard", 
        element: <ProtectedRoute><AppLayout activePage="dashboard"><DashboardPage /></AppLayout></ProtectedRoute> 
      },
      { 
        path: "/campaigns", 
        element: <ProtectedRoute><AppLayout activePage="campaigns"><CampaignsPage /></AppLayout></ProtectedRoute> 
      },
      { 
        path: "/connections", 
        element: <ProtectedRoute><AppLayout activePage="connections"><ConnectionsPage /></AppLayout></ProtectedRoute> 
      },
      { 
        path: "/settings", 
        element: <ProtectedRoute><AppLayout activePage="settings"><SettingsPage /></AppLayout></ProtectedRoute> 
      },
      { 
        path: "/analytics", 
        element: <ProtectedRoute><AppLayout activePage="analytics"><AnalyticsPage /></AppLayout></ProtectedRoute> 
      },
      { 
        path: "/billing", 
        element: <ProtectedRoute><AppLayout activePage="billing"><BillingPage /></AppLayout></ProtectedRoute> 
      },
      { 
        path: "/ad-manager", 
        element: <ProtectedRoute><AppLayout activePage="ad-manager"><AdManagerPage /></AppLayout></ProtectedRoute> 
      },
      // Redirect legacy routes
      { path: "/create-campaign", element: <Navigate to="/ad-manager" replace /> },
      { path: "/campaign/create", element: <Navigate to="/ad-manager" replace /> },
      // 404 handling
      { path: "/not-found", element: <NotFoundPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

// Create browser router
const router = createBrowserRouter(routes);

// Router component to provide the router
export const Router = () => {
  return <RouterProvider router={router} />;
};
