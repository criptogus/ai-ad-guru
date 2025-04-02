
import React from 'react';
import AppLayout from './AppLayout';

// This is a safe wrapper around AppLayout that ensures no router nesting
const SafeAppLayout: React.FC<{ 
  activePage: string;
  children: React.ReactNode;
}> = ({ activePage, children }) => {
  // Use AppLayout directly without creating a new sidebar
  return (
    <AppLayout activePage={activePage}>
      {children}
    </AppLayout>
  );
};

export default SafeAppLayout;
