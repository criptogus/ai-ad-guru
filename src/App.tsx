
import React from 'react';
import { Router } from "./router";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from './hooks/adConnections/utils/navigationUtils';

function App() {
  const navigate = useNavigate();
  
  // Initialize the navigation utility
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <Router />;
}

export default App;
