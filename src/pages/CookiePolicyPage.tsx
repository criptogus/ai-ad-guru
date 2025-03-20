
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

const CookiePolicyPage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cookie Policy | AI Ad Guru</title>
        <meta name="description" content="Cookie Policy for AI Ad Guru - Understanding how we use cookies to improve your experience." />
      </Helmet>
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="pl-0 mb-4 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center mb-6 space-x-3">
            <Cookie className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-sm text-gray-500">Last Updated: {currentDate}</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            Zero Digital Agency uses cookies to improve your experience.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small data files stored on your device to remember your preferences, login details, and campaign analytics.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Cookies</h2>
          <p>We use cookies to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Authenticate users</strong> and keep sessions active.</li>
            <li><strong>Analyze campaign performance</strong> and track ad effectiveness.</li>
            <li><strong>Improve AI recommendations</strong> for ad optimization.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for authentication and secure logins.</li>
            <li><strong>Analytics Cookies:</strong> Tracks user behavior to improve AI predictions.</li>
            <li><strong>Marketing Cookies:</strong> Helps optimize ad targeting across platforms.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Managing Your Cookie Preferences</h2>
          <p>
            You can <strong>disable cookies in your browser settings</strong>, but some features of our platform may not function properly.
          </p>

          <p className="mt-8">
            For questions about cookies, email <strong>privacy@zerodigital.com</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
