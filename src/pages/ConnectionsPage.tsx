
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
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ad Platform Connections</h1>
          <ConnectionsSection />
        </div>
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
