import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const BillingHistoryPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Billing History</h1>
          {/* Billing history content here */}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default BillingHistoryPage;
