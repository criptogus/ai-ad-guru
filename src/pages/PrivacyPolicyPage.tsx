
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

const PrivacyPolicyPage: React.FC = () => {
  const currentDate = "April 11, 2025";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | Zero Digital Agency</title>
        <meta name="description" content="Privacy Policy for Zero Digital Agency - Learn how we collect, use, and protect your information." />
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
            <Lock className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy – Zero Digital Agency</h1>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Effective Date: {currentDate}</p>
            <p>Last Updated: {currentDate}</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            At Zero Digital Agency, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our platform ("Lovable") and associated services.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, company name, profile photo, and password.</li>
            <li><strong>Payment Data:</strong> Processed securely via Stripe. We do not store full credit card numbers.</li>
            <li><strong>Usage Data:</strong> Actions within the platform (e.g., ad creation, campaign performance).</li>
            <li><strong>Ad Account Integrations:</strong> Metadata and campaign data from connected platforms (Google Ads, Meta Ads, LinkedIn Ads, Microsoft Ads).</li>
            <li><strong>Uploaded Files:</strong> Images, customer lists, and ad content.</li>
            <li><strong>Technical Information:</strong> Browser type, IP address, device information, and location data.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide and improve the Lovable platform</li>
            <li>Personalize your experience and content suggestions</li>
            <li>Generate ad copy, images, and insights using AI</li>
            <li>Process payments and manage subscriptions</li>
            <li>Offer customer support and respond to inquiries</li>
            <li>Send essential updates and notifications</li>
          </ul>
          <p className="mt-4 font-medium">We never sell your personal data to third parties.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Use of AI and OpenAI APIs</h2>
          <p>
            We use OpenAI's APIs to generate ad content (text, images, recommendations). Only essential information—such as product or service descriptions—is sent to the API. Personally identifiable information (PII) is never shared with OpenAI.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Use of Third-Party APIs</h2>
          <p>Our platform integrates with the following services:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Google Ads / Google Workspace APIs</li>
            <li>Meta Ads (Facebook and Instagram)</li>
            <li>LinkedIn Ads</li>
            <li>Microsoft Ads</li>
            <li>Stripe (for payment processing)</li>
            <li>Supabase (for database and authentication)</li>
            <li>OpenAI (for generative AI)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Compliance with Google Workspace API Policy</h3>
          <p>
            We confirm that Zero Digital Agency does not use Google Workspace APIs to develop, improve, or train generalized AI or machine learning (ML) models.
          </p>
          <p>
            All data accessed through Google APIs is used solely for the functionality of the Lovable platform. We do not share, sell, or repurpose that data beyond the scope of delivering ad automation and insights. We fully comply with the Google API Services User Data Policy, including all Limited Use requirements.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Data Storage and Security</h2>
          <p>
            Data is securely stored using Supabase infrastructure with encryption at rest and in transit. Access to sensitive data is restricted to authorized personnel only. We follow modern security best practices to protect your information.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">6. Data Retention</h2>
          <p>
            We retain your data as long as your account is active or as necessary to deliver our services. You may request deletion of your personal data at any time by emailing us at support@zeroagency.ai.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">7. Your Privacy Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access and correct your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, please contact support@zeroagency.ai.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">8. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manage user sessions</li>
            <li>Analyze platform usage</li>
            <li>Improve user experience</li>
          </ul>
          <p className="mt-4">
            You can disable cookies in your browser settings, though this may affect platform functionality.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">9. Children's Privacy</h2>
          <p>
            Lovable is not intended for children under 13. We do not knowingly collect personal information from anyone under that age.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Significant changes will be communicated via email or in-app notifications.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how your data is handled, contact us at:
          </p>
          <p className="mt-4">
            <strong>Zero Digital Agency</strong><br />
            Email: contact@zeroagency.ai<br />
            Website: <a href="https://zeroagency.ai" className="text-brand-600 hover:text-brand-700">https://zeroagency.ai</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
