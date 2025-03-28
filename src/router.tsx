
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import TeamPage from './pages/TeamPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AppLayout from './components/AppLayout';
import SafeAppLayout from './components/SafeAppLayout';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import SmartBannerBuilder from './components/smart-banner/SmartBannerBuilder';
import CustomerDataPage from './pages/CustomerDataPage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import PromptTemplatePage from './pages/PromptTemplatePage';

// Import the PromptEditorPage
import PromptEditorPage from './pages/admin/PromptEditorPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/campaign/:campaignId" element={<CampaignDetailsPage />} />
          <Route path="/smart-banner" element={<SmartBannerBuilder />} />
		      <Route path="/customer-data" element={<CustomerDataPage />} />
          <Route path="/company-info" element={<CompanyInfoPage />} />
          <Route path="/tools" element={<PromptTemplatePage />} />
        </Route>
        
        <Route element={<SafeAppLayout />} >
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/prompts" element={<PromptEditorPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
