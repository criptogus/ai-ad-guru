
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";

const SettingsPage: React.FC = () => {
  return (
    <SafeAppLayout activePage="settings">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Settings functionality coming soon.</p>
        </div>
      </div>
    </SafeAppLayout>
  );
};

export default SettingsPage;
