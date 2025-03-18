
import React from "react";

export const Footer: React.FC = () => {
  return (
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
  );
};
