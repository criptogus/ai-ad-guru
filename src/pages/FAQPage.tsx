
import React from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { FAQHero, FAQSection, FAQContact } from "@/components/faq";
import { MessageCircle, CreditCard, Link as LinkIcon, Zap, Wrench } from "lucide-react";

const FAQPage: React.FC = () => {
  const generalQuestions = [
    {
      id: "faq-1",
      question: "What is Zero Digital Agency?",
      answer: (
        <p>
          Zero Digital Agency is an AI-powered ad management platform that helps businesses create, optimize, and manage their ad campaigns across Google Ads, Meta Ads (Instagram & Facebook), LinkedIn Ads, and Microsoft Ads (Bing) using cutting-edge AI technology.
        </p>
      )
    },
    {
      id: "faq-2",
      question: "How does AI improve my ad campaigns?",
      answer: (
        <div>
          <p>Our AI analyzes real-time campaign data and:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Creates optimized ad copy and creatives tailored for your audience.</li>
            <li>Monitors campaign performance and automatically reallocates budgets to high-performing ads.</li>
            <li>Detects underperforming ads and suggests improvements (e.g., better headlines, CTAs, or audience targeting).</li>
          </ul>
        </div>
      )
    },
    {
      id: "faq-3",
      question: "Can I manage ads for multiple platforms in one place?",
      answer: (
        <p>
          Yes! Our platform allows you to manage Google, Meta (Facebook & Instagram), LinkedIn, and Microsoft Ads from a single dashboard, eliminating the need to switch between multiple ad managers.
        </p>
      )
    }
  ];

  const billingQuestions = [
    {
      id: "faq-4",
      question: "How does the subscription work?",
      answer: (
        <div>
          <p>We offer a monthly subscription ($99/month) that includes:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>AI-powered ad creation & optimization</li>
            <li>Multi-platform ad management</li>
            <li>Real-time performance insights</li>
          </ul>
        </div>
      )
    },
    {
      id: "faq-5",
      question: "What is the AI credit system?",
      answer: (
        <div>
          <p>Each user receives AI credits to generate ads (text + images). When you create a new ad or make changes, credits are deducted. Additional credits can be purchased if needed.</p>
          <table className="min-w-full divide-y divide-gray-200 mt-2">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-xs font-medium text-gray-500">AI Credits</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500">Price</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500">Usage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2 text-sm">100 credits</td>
                <td className="px-3 py-2 text-sm">$29</td>
                <td className="px-3 py-2 text-sm">Generate text & image ads</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-sm">500 credits</td>
                <td className="px-3 py-2 text-sm">$99</td>
                <td className="px-3 py-2 text-sm">For frequent advertisers</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: "faq-6",
      question: "How does the 10% AI ad management fee work?",
      answer: (
        <div>
          <p>
            Our AI optimizes your campaign by reallocating budgets, pausing low-performing ads, and improving targeting. To support this automated optimization, we charge 10% of your ad spend.
          </p>
          <p className="mt-2">
            For example:
          </p>
          <p className="mt-1">
            📢 If you spend $500 on ads, we charge $50 for AI management services.
          </p>
        </div>
      )
    },
    {
      id: "faq-7",
      question: "What payment methods do you accept?",
      answer: (
        <p>
          We accept all major credit cards, debit cards, and Stripe-supported payment methods.
        </p>
      )
    },
    {
      id: "faq-8",
      question: "Do you offer refunds?",
      answer: (
        <p>
          Since AI-generated ads require processing costs, we do not offer refunds on used credits or active subscriptions. If you experience any issues, contact support@zerodigital.com.
        </p>
      )
    }
  ];

  const platformQuestions = [
    {
      id: "faq-9",
      question: "How do I connect my ad accounts?",
      answer: (
        <p>
          You can easily link your Google Ads, Meta Ads, LinkedIn Ads, and Microsoft Ads accounts through OAuth authentication. Just follow the guided steps in your dashboard settings.
        </p>
      )
    },
    {
      id: "faq-10",
      question: "What happens if my ad account gets suspended?",
      answer: (
        <p>
          Zero Digital Agency follows advertising best practices, but we are not responsible for suspensions imposed by ad platforms. If your account is suspended, check the ad platform's policy and resolve the issue directly with their support team.
        </p>
      )
    },
    {
      id: "faq-11",
      question: "Can I edit AI-generated ads before publishing?",
      answer: (
        <p>
          Yes! Our AI suggests multiple ad variations, but you have full control over the final ad copy, images, and targeting before launching your campaign.
        </p>
      )
    }
  ];

  const performanceQuestions = [
    {
      id: "faq-12",
      question: "How accurate is the AI in generating high-performing ads?",
      answer: (
        <p>
          Our AI analyzes millions of ad data points to craft optimized ad content, but no AI can guarantee results. We recommend A/B testing AI-generated ads to find what works best for your business.
        </p>
      )
    },
    {
      id: "faq-13",
      question: "Will AI fully replace human ad managers?",
      answer: (
        <p>
          AI automates repetitive tasks (e.g., bid adjustments, copywriting, budget reallocation), but human strategy and oversight are still valuable for creative decisions and long-term planning.
        </p>
      )
    },
    {
      id: "faq-14",
      question: "How often does AI optimize my ads?",
      answer: (
        <p>
          Our AI reviews campaign performance every 24 hours and makes real-time recommendations. You can also customize optimization frequency in your dashboard.
        </p>
      )
    }
  ];

  const troubleshootingQuestions = [
    {
      id: "faq-15",
      question: "My AI-generated image is not displaying. What should I do?",
      answer: (
        <div>
          <p>If an AI-generated image does not appear, try the following:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Refresh the page.</li>
            <li>Check Supabase Storage settings (if images are not being stored properly).</li>
            <li>Ensure your subscription has active AI credits.</li>
          </ul>
        </div>
      )
    },
    {
      id: "faq-16",
      question: "How do I cancel my subscription?",
      answer: (
        <p>
          You can cancel your subscription anytime in your billing settings. Your account will remain active until the end of your billing period.
        </p>
      )
    },
    {
      id: "faq-17",
      question: "I need help with my campaign. How do I contact support?",
      answer: (
        <div>
          <p>
            Our support team is available Monday - Friday (9 AM - 6 PM UTC).
          </p>
          <p className="mt-2">
            📩 Email us at contact@zerodigital.com
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Frequently Asked Questions | Zero Digital Agency</title>
        <meta name="description" content="Common questions about Zero Digital Agency's AI-powered ad management platform. Learn about our product features, pricing, and how AI improves your campaigns." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        <FAQHero />
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <FAQSection 
            title="📌 General Questions" 
            icon={<MessageCircle className="h-6 w-6 text-brand-600" />} 
            questions={generalQuestions} 
          />
          
          <FAQSection 
            title="💳 Billing & Payments" 
            icon={<CreditCard className="h-6 w-6 text-brand-600" />} 
            questions={billingQuestions} 
          />
          
          <FAQSection 
            title="🔗 Platform & Integration" 
            icon={<LinkIcon className="h-6 w-6 text-brand-600" />} 
            questions={platformQuestions} 
          />
          
          <FAQSection 
            title="⚡ AI & Performance" 
            icon={<Zap className="h-6 w-6 text-brand-600" />} 
            questions={performanceQuestions} 
          />
          
          <FAQSection 
            title="🛠️ Troubleshooting & Support" 
            icon={<Wrench className="h-6 w-6 text-brand-600" />} 
            questions={troubleshootingQuestions} 
          />
          
          <FAQContact />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
