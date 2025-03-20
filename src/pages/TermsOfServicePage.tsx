
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

const TermsOfServicePage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service | AI Ad Guru</title>
        <meta name="description" content="Terms of Service for AI Ad Guru - Review our terms before using our AI-powered ad management platform." />
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
            <FileText className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-sm text-gray-500">Last Updated: {currentDate}</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            By using Zero Digital Agency ("Platform," "Service"), you agree to the following terms. If you do not agree, do not use our services.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Description of Service</h2>
          <p>
            Zero Digital Agency provides an <strong>AI-powered ad management platform</strong> that helps businesses create and optimize ad campaigns on Google, Meta, LinkedIn, and Microsoft Ads.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must <strong>comply with all ad platform policies</strong>.</li>
            <li>Users are <strong>responsible for reviewing AI-generated content</strong> before publishing.</li>
            <li>Users must <strong>not use our platform for prohibited content</strong>, including illegal, misleading, or harmful ads.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. AI Limitations & Liability Disclaimer</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>AI-generated ads may contain errors.</strong> We do not guarantee accuracy or compliance with advertising regulations.</li>
            <li>Zero Digital Agency <strong>is not responsible for any financial loss</strong> due to AI-generated content, ad performance, or account suspensions by third-party platforms.</li>
            <li>Users <strong>acknowledge that AI decisions are probabilistic</strong> and should not be considered final business advice.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Payments & Refunds</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users are billed via <strong>Stripe</strong> on a subscription basis.</li>
            <li>AI-generated ad budgets include a <strong>10% management fee</strong> on ad spend.</li>
            <li>Refunds are not provided for AI-generated content errors, ad performance issues, or user-initiated campaign failures.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Account Termination</h2>
          <p>
            Zero Digital Agency reserves the right to suspend or terminate accounts for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violation of <strong>ad platform policies</strong>.</li>
            <li>Abuse of AI tools or fraudulent activity.</li>
            <li>Non-payment or unauthorized chargebacks.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, <strong>Zero Digital Agency is not liable for any direct, indirect, or incidental damages arising from the use of AI-generated ads, API integrations, or ad performance outcomes.</strong>
          </p>

          <p className="mt-8">
            For disputes, contact us at <strong>legal@zerodigital.com</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
