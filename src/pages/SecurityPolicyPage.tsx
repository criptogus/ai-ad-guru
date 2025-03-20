
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

const SecurityPolicyPage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Security Policy | AI Ad Guru</title>
        <meta name="description" content="Security Policy for AI Ad Guru - Learn how we protect your data and ensure platform security." />
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
            <h1 className="text-3xl font-bold text-gray-900">Security Policy</h1>
          </div>
          <p className="text-sm text-gray-500">Last Updated: {currentDate}</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            Zero Digital Agency is committed to protecting user data and ensuring platform security.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Data Protection & Encryption</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All user data is encrypted <strong>at rest and in transit</strong>.</li>
            <li>API connections (Google Ads, Meta, LinkedIn, Microsoft Ads) use <strong>OAuth authentication</strong>.</li>
            <li>Payment transactions are securely processed through <strong>Stripe</strong>, which is PCI-DSS compliant.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">2. AI System Security</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>AI models operate within a <strong>secured cloud environment</strong>.</li>
            <li>User-generated data is never shared or used to train external AI models.</li>
            <li>AI outputs are regularly reviewed for compliance with advertising guidelines.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. User Access Control</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Multi-factor authentication (MFA) is recommended for user accounts.</li>
            <li>Role-based permissions limit access to <strong>campaigns, budgets, and analytics</strong>.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Incident Response Plan</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We monitor for security breaches and vulnerabilities <strong>24/7</strong>.</li>
            <li>In the event of a breach, affected users will be <strong>notified within 72 hours</strong>.</li>
            <li>Users should report security concerns to <strong>security@zerodigital.com</strong>.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SecurityPolicyPage;
