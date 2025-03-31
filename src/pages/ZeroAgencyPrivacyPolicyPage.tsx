
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

const ZeroAgencyPrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | Zero Agency</title>
        <meta name="description" content="Privacy Policy for Zero Agency - Learn how we collect, use, and protect your information." />
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
            <Shield className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">🔒 Zero Agency Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-500">Effective Date: March 1, 2025</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            At Zero Agency, your privacy is our priority. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform and services.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">a. Personal Information</h3>
          <p>We collect the following personal data when you create an account or use our services:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Company information</li>
            <li>OAuth tokens for ad platform integrations (e.g., Google Ads, Meta, LinkedIn)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">b. Usage Data</h3>
          <p>We collect data about your interactions with the platform, such as:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Campaign creation activity</li>
            <li>Ad performance metrics</li>
            <li>Credit usage and billing</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">c. Uploaded Content</h3>
          <p>You may upload media files, texts, and customer data (e.g., email lists) to generate and manage ads.</p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide and improve our AI-powered advertising services</li>
            <li>Generate ad creatives and performance reports</li>
            <li>Manage billing and credit systems</li>
            <li>Connect with third-party ad platforms securely via OAuth</li>
            <li>Send important service updates and support communications</li>
          </ul>

          <p className="font-medium mt-4">
            We <strong>do not sell, rent, or share</strong> your data with third parties for marketing purposes.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">3. Data Storage and Security</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All user data is securely stored using encrypted databases.</li>
            <li>Access tokens are encrypted and stored separately from user credentials.</li>
            <li>We use secure HTTPS protocols and comply with industry-standard best practices to prevent data breaches.</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We integrate with third-party APIs (e.g., Google Ads, Meta, LinkedIn, Stripe) to deliver our services. 
            These platforms may also collect data as per their respective privacy policies.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">5. User Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access and update your information</li>
            <li>Revoke access to connected ad platforms</li>
            <li>Request account deletion and data erasure</li>
          </ul>

          <p className="mt-4">
            To exercise your rights, contact us at [support@zeroagency.ai].
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">6. Cookies</h2>
          <p>We use cookies to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Authenticate sessions</li>
            <li>Store user preferences</li>
            <li>Improve site performance</li>
          </ul>

          <p className="mt-4">
            You can control cookie settings through your browser.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify users of significant changes through the platform or by email.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact:
            <br />
            📧 contact@zeroagency.ai
          </p>

          <p className="mt-8 text-center font-medium">
            Thank you for trusting Zero Agency.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ZeroAgencyPrivacyPolicyPage;
