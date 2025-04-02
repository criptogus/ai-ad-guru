
import React from "react";
import ConnectionsSection from "@/components/config/ConnectionsSection";
import AppLayout from "@/components/AppLayout";

const ConnectionsPage: React.FC = () => {
  return (
    <AppLayout activePage="config">
      <div className="w-full">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <ConnectionsSection />
        </div>
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
