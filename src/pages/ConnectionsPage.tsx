
import React from "react";
import AppLayout from "@/components/AppLayout";
import ConnectionsSection from "@/components/config/ConnectionsSection";

const ConnectionsPage: React.FC = () => {
  return (
    <AppLayout activePage="connections">
      <ConnectionsSection />
    </AppLayout>
  );
};

export default ConnectionsPage;
