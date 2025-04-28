
import React, { lazy, Suspense } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate as ReactRouterNavigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import MainLayout from '@/components/layout/MainLayout';
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
const LandingPage = lazy(() => import('@/pages/LandingPage'));

// Create the router
const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Suspense fallback={<Loading />}><LandingPage /></Suspense>
  },
  {
    path: "/pricing",
    element: <Suspense fallback={<Loading />}><PricingPage /></Suspense>
  },
  // Auth routes
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Suspense fallback={<Loading />}><Authentication /></Suspense>
      },
      {
        path: "register",
        element: <Suspense fallback={<Loading />}><Authentication /></Suspense>
      },
      {
        index: true,
        element: <ReactRouterNavigate to="/auth/login" replace />
      }
    ]
  },
  {
    path: "/callback",
    element: <Suspense fallback={<Loading />}><OAuthCallbackHandler /></Suspense>
  },
  // Protected routes with MainLayout
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="dashboard">
                <DashboardPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: "campaigns",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="campaigns">
                <CampaignsPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: "connections",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="connections">
                <ConnectionsPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: "settings",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="settings">
                <SettingsPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: "analytics",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="analytics">
                <AnalyticsPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: "billing",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="billing">
                <BillingPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: "ad-manager",
        element: (
          <RequireAuth>
            <Suspense fallback={<Loading />}>
              <AppLayout activePage="ad-manager">
                <AdManagerPage />
              </AppLayout>
            </Suspense>
          </RequireAuth>
        )
      }
    ]
  },
  // Redirect legacy routes
  {
    path: "/create-campaign",
    element: <ReactRouterNavigate to="/ad-manager" replace />
  },
  {
    path: "/campaign/create",
    element: <ReactRouterNavigate to="/ad-manager" replace />
  },
  // 404 handling
  {
    path: "/not-found",
    element: <Suspense fallback={<Loading />}><NotFoundPage /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<Loading />}><NotFound /></Suspense>
  }
]);

// RequireAuth component
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to the login page if not authenticated
    return <ReactRouterNavigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// NavigationControl to handle navigation (renamed from Navigate to avoid conflicts)
function NavigationControl({ to, state, replace }: { to: string; state?: any; replace?: boolean }) {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate(to, { state, replace });
  }, [navigate, to, state, replace]);
  
  return null;
}

// Export the Router component that provides the router
export const Router = () => {
  return <RouterProvider router={router} />;
};
