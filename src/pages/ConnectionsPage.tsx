
// ====================================================
// 🚨 DO NOT MODIFY, MOVE, OR DELETE THIS FILE! 🚨
// This is a LIVE PRODUCTION PAGE for Connections.
// Only the project owner may approve changes.
// See: src/config/protectedPages.ts
// ====================================================
import React from "react";
import AppLayout from "@/components/AppLayout";
import ConnectionsSection from "@/components/config/ConnectionsSection";

const ConnectionsPage: React.FC = () => {
  return (
    <AppLayout activePage="connections">
      <div className="w-full">
        <ConnectionsSection />
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
