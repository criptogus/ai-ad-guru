
import React from "react";
import ConnectionsSection from "@/components/config/ConnectionsSection";
import AppLayout from "@/components/AppLayout";

const ConnectionsPage: React.FC = () => {
  return (
    <AppLayout activePage="config">
      <div className="px-6 py-6 w-full">
        <div className="mx-auto max-w-7xl">
          <ConnectionsSection />
        </div>
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
