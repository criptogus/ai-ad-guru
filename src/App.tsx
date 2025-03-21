
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ConfigPage from "./pages/ConfigPage";
import BillingPage from "./pages/BillingPage";
import ProfilePage from "./pages/ProfilePage";
import AIInsightsPage from "./pages/AIInsightsPage";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FeaturesPage from "./pages/FeaturesPage";
import RoadmapPage from "./pages/RoadmapPage";
import FAQPage from "./pages/FAQPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import SecurityPolicyPage from "./pages/SecurityPolicyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserRolesPage from "./pages/UserRolesPage";
import OpenAITestPage from "./pages/OpenAITestPage";
import TestAdsPage from "./pages/TestAdsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import SmartBannerBuilderPage from "./pages/SmartBannerBuilderPage";
import { ThemeProvider } from "./components/ui/theme-provider";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <LanguageProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                <Route path="/security-policy" element={<SecurityPolicyPage />} />

                {/* Protected routes - require authentication */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaigns"
                  element={
                    <ProtectedRoute>
                      <CampaignsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-campaign"
                  element={
                    <ProtectedRoute>
                      <CreateCampaignPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/smart-banner"
                  element={
                    <ProtectedRoute>
                      <SmartBannerBuilderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/config"
                  element={
                    <ProtectedRoute>
                      <ConfigPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/billing"
                  element={
                    <ProtectedRoute>
                      <BillingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-insights"
                  element={
                    <ProtectedRoute>
                      <AIInsightsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-roles"
                  element={
                    <ProtectedRoute>
                      <UserRolesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/openai-test"
                  element={
                    <ProtectedRoute>
                      <OpenAITestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/test-ads"
                  element={
                    <ProtectedRoute>
                      <TestAdsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <SonnerToaster position="bottom-right" />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
