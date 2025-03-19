
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPayment?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPayment = false // Changed default to false to make testing easier
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in a payment verification flow
  const isPaymentVerification = location.search.includes('session_id=');

  useEffect(() => {
    if (!isLoading) {
      // Skip authentication redirection during payment verification
      if (isPaymentVerification) {
        console.log('Payment verification in progress, bypassing authentication check');
        return;
      }

      if (!isAuthenticated) {
        // Store the attempted URL for redirection after login
        console.log('User not authenticated, redirecting to login');
        navigate("/login", { state: { from: location.pathname } });
      } else if (requiresPayment && user && !user.hasPaid) {
        // Redirect to billing page if payment is required but user hasn't paid
        console.log('User not paid, redirecting to billing');
        navigate("/billing");
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, requiresPayment, user, isPaymentVerification]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Always render children during payment verification
  if (isPaymentVerification) {
    console.log('Rendering children for payment verification flow');
    return <>{children}</>;
  }

  // Don't render children when not authenticated or when payment is required but not paid
  if (!isAuthenticated) return null;
  if (requiresPayment && user && !user.hasPaid) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
