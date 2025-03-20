
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPayment?: boolean;
  requiredRole?: string; // Add support for role-based access control
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPayment = false,
  requiredRole
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

      // Handle authentication check
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        // Store the current path for redirection after login
        const returnPath = `${location.pathname}${location.search}`;
        navigate("/login", { 
          state: { from: returnPath },
          // Use replace to prevent back button from taking users to protected routes
          replace: true 
        });
      } 
      // Handle payment requirement check
      else if (requiresPayment && user && !user.hasPaid) {
        console.log('User not paid, redirecting to billing');
        navigate("/billing", { replace: true });
      }
      // Handle role-based access control
      else if (requiredRole && user) {
        // This is a simplified role check - implement proper role checking based on your data structure
        const hasRequiredRole = user.user_metadata?.role === requiredRole;
        if (!hasRequiredRole) {
          console.log(`User lacks required role: ${requiredRole}, access denied`);
          navigate("/dashboard", { 
            state: { 
              accessDenied: true, 
              requiredRole 
            },
            replace: true
          });
        }
      }
    }
  }, [
    isAuthenticated, 
    isLoading, 
    navigate, 
    location.pathname, 
    location.search,
    requiresPayment, 
    user, 
    isPaymentVerification,
    requiredRole
  ]);

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
  if (requiredRole && user && user.user_metadata?.role !== requiredRole) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
