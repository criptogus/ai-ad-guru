
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

const PrivacyPolicyPage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | AI Ad Guru</title>
        <meta name="description" content="Privacy Policy for AI Ad Guru - Learn how we collect, use, and protect your information." />
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-500">Last Updated: {currentDate}</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            Zero Digital Agency ("Company," "we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our AI-powered advertising platform.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>User Account Data:</strong> Name, email, billing information.</li>
            <li><strong>Advertising Data:</strong> Ad campaigns, performance metrics, user preferences.</li>
            <li><strong>Usage Data:</strong> Log files, IP address, device/browser information.</li>
            <li><strong>Third-Party Data:</strong> Information from connected ad platforms (Google Ads, Meta Ads, LinkedIn Ads, Microsoft Ads).</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To <strong>create and optimize ad campaigns</strong> using AI.</li>
            <li>To provide <strong>customer support and billing management</strong>.</li>
            <li>To <strong>improve AI models</strong> and refine ad performance recommendations.</li>
            <li>To comply with <strong>legal obligations</strong> and prevent fraud.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. AI-Generated Content Disclaimer</h2>
          <p>
            Zero Digital Agency utilizes AI-generated content for advertising. <strong>While we strive for accuracy, AI may produce content that is inaccurate, outdated, or inappropriate.</strong> Users are responsible for reviewing and approving all AI-generated ads before publishing. We do not guarantee the performance of AI-generated advertising.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Data Security & Protection</h2>
          <p>
            We implement industry-standard security measures, including <strong>encryption, access controls, and regular audits</strong>. However, <strong>no system is 100% secure</strong>, and we cannot guarantee the absolute security of user data.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Sharing Your Information</h2>
          <p>
            We <strong>do not sell</strong> your data. We only share information with:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Ad platforms</strong> (Google, Meta, LinkedIn, Microsoft) to run campaigns.</li>
            <li><strong>Payment providers</strong> (Stripe) to process transactions.</li>
            <li><strong>Legal authorities</strong> when required by law.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">6. Your Rights & Choices</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You can <strong>update or delete</strong> your data.</li>
            <li>You can <strong>opt out of marketing emails</strong> anytime.</li>
            <li>You can <strong>disconnect ad platforms</strong> at any time.</li>
          </ul>

          <p className="mt-8">
            For questions, contact us at <strong>support@zerodigital.com</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
