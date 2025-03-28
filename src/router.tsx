
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import UserRolesPage from './pages/UserRolesPage'; // Using this instead of TeamPage
import NotFound from './pages/NotFound'; // Using this instead of NotFoundPage
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import SafeAppLayout from './components/SafeAppLayout';
import CreateCampaignPage from './pages/CreateCampaignPage';
import SmartBannerBuilder from './components/smart-banner/SmartBannerBuilder';
import PromptTemplatePage from './pages/PromptTemplatePage';

// Import the PromptEditorPage
import PromptEditorPage from './pages/admin/PromptEditorPage';

// Since we don't have actual admin page, create a placeholder
const AdminPage = () => <div>Admin Dashboard</div>;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        <Route path="dashboard" element={<AppLayout activePage="dashboard"><DashboardPage /></AppLayout>} />
        <Route path="settings" element={<AppLayout activePage="settings"><SettingsPage /></AppLayout>} />
        <Route path="team" element={<AppLayout activePage="team"><UserRolesPage /></AppLayout>} />
        <Route path="create-campaign" element={<AppLayout activePage="campaigns"><CreateCampaignPage /></AppLayout>} />
        <Route path="campaign/:campaignId" element={<AppLayout activePage="campaigns"><div>Campaign Details</div></AppLayout>} />
        <Route path="smart-banner" element={<AppLayout activePage="smart-banner"><SmartBannerBuilder /></AppLayout>} />
        <Route path="customer-data" element={<AppLayout activePage="customer-data"><div>Customer Data</div></AppLayout>} />
        <Route path="company-info" element={<AppLayout activePage="company-info"><div>Company Info</div></AppLayout>} />
        <Route path="tools" element={<AppLayout activePage="tools"><PromptTemplatePage /></AppLayout>} />
        
        <Route path="admin" element={<SafeAppLayout activePage="admin"><AdminPage /></SafeAppLayout>} />
        <Route path="admin/prompts" element={<SafeAppLayout activePage="admin"><PromptEditorPage /></SafeAppLayout>} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
