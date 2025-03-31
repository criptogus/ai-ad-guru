
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
        <title>Terms of Service | Zero Agency</title>
        <meta name="description" content="Terms of Service for Zero Agency - Review our terms before using our AI-powered ad management platform." />
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
            <h1 className="text-3xl font-bold text-gray-900">📄 Zero Agency – Terms of Use</h1>
          </div>
          <p className="text-sm text-gray-500">Effective Date: March 1, 2025</p>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">
            Welcome to Zero Agency. These Terms of Use govern your access to and use of our website, platform, and services ("Services"). By using Zero Agency, you agree to be bound by these terms.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using the platform, you acknowledge that you have read, understood, and agree to comply with these Terms of Use and our Privacy Policy.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">2. Use of Services</h2>
          <p>You may use our Services solely for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the platform for any fraudulent, illegal, or abusive purpose</li>
            <li>Interfere with the security or functionality of the Services</li>
            <li>Reverse engineer or attempt to access the source code</li>
          </ul>
          <p>Zero Agency reserves the right to suspend or terminate your access if you violate these terms.</p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">3. Account and Access</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You must be at least 18 years old to use the Services.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">4. Payments and Credits</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Our services are billed via a subscription or pay-per-use credit system.</li>
            <li>By providing your payment details, you authorize us to charge your account as outlined in your selected plan.</li>
            <li>Failure to pay may result in suspension or termination of Services.</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">5. Content and Intellectual Property</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You retain ownership of all content and data you upload.</li>
            <li>By using our Services, you grant Zero Agency a license to use, host, and process your data solely for the purpose of delivering our Services.</li>
            <li>All platform code, designs, and algorithms are the intellectual property of Zero Agency.</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">6. Third-Party Integrations</h2>
          <p>
            Our platform integrates with third-party services (e.g., Google Ads, Meta, LinkedIn). Your use of these services is subject to their respective terms and policies. We are not responsible for third-party platforms or any data processed through them.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users or to Zero Agency.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">8. Disclaimer of Warranties</h2>
          <p>The Services are provided "as is" without warranties of any kind. We do not guarantee that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The Services will be uninterrupted or error-free</li>
            <li>The results obtained through the Services will be accurate or reliable</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Zero Agency is not liable for any indirect, incidental, or consequential damages arising from your use of the Services.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">10. Modifications to Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Services after changes constitutes your acceptance of the revised Terms.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction where Zero Agency is registered, without regard to its conflict of laws rules.
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mt-8 mb-4">12. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            📧 support@zeroagency.ai
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
