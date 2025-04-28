
import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
  Navigate
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

  return <AppLayout><Suspense fallback={<Loading />}>{children}</Suspense></AppLayout>;
};

// PublicRoute component to restrict access to authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      {/* Auth routes */}
      <Route path="/auth">
        <Route path="login" element={<PublicRoute><Authentication /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Authentication /></PublicRoute>} />
        <Route index element={<Navigate to="/auth/login" replace />} />
      </Route>
      
      {/* OAuth callback route */}
      <Route path="/callback" element={<OAuthCallbackHandler />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
      <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
      <Route path="/ad-manager" element={<ProtectedRoute><AdManagerPage /></ProtectedRoute>} />

      {/* Redirect legacy routes */}
      <Route path="/create-campaign" element={<Navigate to="/ad-manager" replace />} />
      <Route path="/campaign/create" element={<Navigate to="/ad-manager" replace />} />
      
      {/* 404 handling */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

// Router component to provide the router
export const Router = () => {
  return <RouterProvider router={router} />;
};
