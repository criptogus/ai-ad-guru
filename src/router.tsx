
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

// Lazy load components for route-based code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const ConnectionsPage = lazy(() => import('@/pages/ConnectionsPage'));
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Import the ad manager page
import AdManagerPage from "@/pages/AdManagerPage";

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <AppLayout><Suspense fallback={<Loading />}>{children}</Suspense></AppLayout>;
};

// PublicRoute component to restrict access to authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

// Router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
      
      {/* Redirect from old campaign routes to the new ad-manager route */}
      <Route path="/campaign/create" element={<Navigate to="/ad-manager" replace />} />
      <Route path="/create-campaign" element={<Navigate to="/ad-manager" replace />} />
      
      <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Ad Manager route */}
      <Route path="/ad-manager" element={<ProtectedRoute><AdManagerPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

// Router component to provide the router
export const Router = () => {
  return <RouterProvider router={router} />;
};
