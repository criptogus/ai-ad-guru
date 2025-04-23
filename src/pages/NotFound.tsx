
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  // Redirect to the new NotFoundPage
  return <Navigate to="/not-found" replace />;
};

export default NotFound;
