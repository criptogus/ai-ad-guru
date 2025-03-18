
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  LineChart, 
  BrainCircuit,
  CircleDollarSign 
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold">
                AG
              </div>
              <span className="ml-2 text-xl font-bold">AI Ad Guru</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate("/register")}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Create High-Converting Ads with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 md:max-w-3xl mx-auto">
            Generate, optimize, and manage your Google and Meta ads with the power
            of GPT-4 and DALL-E 3. Less effort, better results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="text-lg px-8 bg-white text-brand-700 hover:bg-gray-100"
              onClick={() => navigate("/register")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white/20 font-medium"
              onClick={() => navigate("/pricing")}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How AI Ad Guru Works</h2>
            <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
              Our platform uses advanced AI to create, optimize, and manage your ad campaigns
              across Google and Meta platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Creation</h3>
              <p className="text-gray-600">
                Our AI analyzes your website and generates optimized ad copy and
                creatives tailored to your business.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Variations</h3>
              <p className="text-gray-600">
                Generate 5 high-performing ad variations with a single click and
                choose the best ones for your campaign.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Automatic Optimization</h3>
              <p className="text-gray-600">
                Our AI continuously analyzes performance and optimizes your campaigns
                for maximum ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 3-Step Process</h2>
            <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
              Creating high-converting ad campaigns has never been easier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Your Website</h3>
              <p className="text-gray-600">
                Provide your website URL and our AI will analyze your business
                and industry.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Select Ad Type</h3>
              <p className="text-gray-600">
                Choose between Google Search Ads or Meta (Facebook/Instagram) 
                image ads.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Launch Campaign</h3>
              <p className="text-gray-600">
                Review AI-generated ads, make edits if needed, and publish
                to platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
              Get started today with our affordable subscription plan.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-8 text-center gradient-bg text-white">
                <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-lg ml-2">/month</span>
                </div>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>400 credits per month (1 campaign = 5 credits)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>AI-generated ad copy and images</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Google & Meta ad campaign management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>24-hour automated campaign optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>10% of ad spend fee via Stripe</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Shield className="h-10 w-10 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is always protected with enterprise-grade security.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <CircleDollarSign className="h-10 w-10 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">
                Transparent pricing with no surprise charges.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Sparkles className="h-10 w-10 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Support</h3>
              <p className="text-gray-600">
                Our team is always available to help with your campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Ad Campaigns?</h2>
          <p className="text-xl mb-8">
            Get started today and see the difference AI can make for your business.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 bg-white text-brand-700 hover:bg-gray-100"
            onClick={() => navigate("/register")}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">Features</button></li>
                <li><button className="text-gray-400 hover:text-white">Pricing</button></li>
                <li><button className="text-gray-400 hover:text-white">Testimonials</button></li>
                <li><button className="text-gray-400 hover:text-white">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">About</button></li>
                <li><button className="text-gray-400 hover:text-white">Blog</button></li>
                <li><button className="text-gray-400 hover:text-white">Careers</button></li>
                <li><button className="text-gray-400 hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">Documentation</button></li>
                <li><button className="text-gray-400 hover:text-white">Help Center</button></li>
                <li><button className="text-gray-400 hover:text-white">API</button></li>
                <li><button className="text-gray-400 hover:text-white">Status</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">Privacy</button></li>
                <li><button className="text-gray-400 hover:text-white">Terms</button></li>
                <li><button className="text-gray-400 hover:text-white">Security</button></li>
                <li><button className="text-gray-400 hover:text-white">Cookies</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold">
                AG
              </div>
              <span className="ml-2 text-lg font-bold">AI Ad Guru</span>
            </div>
            <div className="text-gray-400">
              © {new Date().getFullYear()} AI Ad Guru. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
