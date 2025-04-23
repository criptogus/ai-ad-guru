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
import { MainLayout } from '@/layouts/MainLayout';
import { Loading } from '@/components/ui/loading/Loading';

// Lazy load components for route-based code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const ConnectionsPage = lazy(() => import('@/pages/ConnectionsPage'));
const CampaignCreatePage = lazy(() => import('@/pages/CampaignCreatePage'));
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage'));
const CampaignDetailsPage = lazy(() => import('@/pages/CampaignDetailsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const SecurityLogsPage = lazy(() => import('@/pages/SecurityLogsPage'));

// Import the new page
import AdManagerPage from "@/pages/AdManagerPage";

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? <MainLayout><Suspense fallback={<Loading />}>{children}</Suspense></MainLayout> : <Navigate to="/login" />;
};

// PublicRoute component to restrict access to authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return !user ? <Suspense fallback={<Loading />}>{children}</Suspense> : <Navigate to="/" />;
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
      <Route path="/campaign/create" element={<ProtectedRoute><CampaignCreatePage /></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
      <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetailsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/security-logs" element={<ProtectedRoute><SecurityLogsPage /></ProtectedRoute>} />
      
      {/* Add the new route to the routes array */}
      <Route path="/ad-manager" element={<ProtectedRoute><AdManagerPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

// Router component to provide the router
export const Router = () => {
  return <RouterProvider router={router} />;
};
