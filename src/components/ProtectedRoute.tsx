import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/auth/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPayment?: boolean;
  requiredRole?: string;
  requiresMFA?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPayment = false,
  requiredRole,
  requiresMFA = false
}) => {
  try {
    const { isAuthenticated, isLoading, user, checkSubscriptionStatus } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if we're in a payment verification flow
    const isPaymentVerification = location.search.includes('session_id=');

    useEffect(() => {
      // Skip authentication redirection during payment verification
      if (isPaymentVerification) {
        console.log('Payment verification in progress, bypassing authentication check');
        return;
      }

      // Don't redirect while still loading
      if (isLoading) {
        return;
      }

      const verifyAccess = async () => {
        // Handle authentication check
        if (!isAuthenticated) {
          console.log('User not authenticated, redirecting to login');
          
          // Store the current path for redirection after login
          const returnPath = `${location.pathname}${location.search}`;
          
          navigate("/auth/login", { 
            state: { 
              from: returnPath
            },
            // Use replace to prevent back button from taking users to protected routes
            replace: true 
          });
          return;
        } 
        
        // Handle payment requirement check for routes that need it
        if (requiresPayment && user) {
          // If user has paid flag, we don't need further checks
          if (user.hasPaid) {
            console.log('User has paid flag set, allowing access');
            return;
          }
          
          // Otherwise verify with Stripe before deciding
          console.log('Checking subscription status for user:', user.id);
          const hasActiveSubscription = await checkSubscriptionStatus();
          
          if (!hasActiveSubscription) {
            console.log('User does not have active subscription, redirecting to billing');
            navigate("/billing", { replace: true });
            return;
          }
        }
        
        // Handle role-based access control
        if (requiredRole && user) {
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
            return;
          }
        }
        
        // Handle MFA requirement check
        if (requiresMFA && user) {
          // Check if user has completed MFA verification
          const hasMFAVerified = user.user_metadata?.mfa_verified === true;
          
          if (!hasMFAVerified) {
            console.log('MFA verification required');
            navigate("/mfa-verification", {
              state: {
                returnTo: location.pathname,
              },
              replace: true
            });
            return;
          }
        }
      };
      
      verifyAccess();
    }, [
      isAuthenticated, 
      isLoading, 
      user,
      navigate,
      location,
      requiresPayment, 
      requiredRole,
      requiresMFA,
      isPaymentVerification,
      checkSubscriptionStatus
    ]);

    if (isLoading) {
      return <LoadingState />;
    }

    // Always render children during payment verification
    if (isPaymentVerification) {
      console.log('Rendering children for payment verification flow');
      return <>{children}</>;
    }

    // Don't render children when not authenticated or unauthorized
    if (!isAuthenticated) return null;

    return <>{children}</>;
  } catch (error) {
    // If useAuth hook fails (e.g., used outside AuthProvider), render a fallback
    console.error("AuthProvider not initialized:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h2 className="mt-4 text-xl font-semibold">Initializing authentication...</h2>
        <p className="mt-2 text-muted-foreground">Please wait a moment.</p>
      </div>
    );
  }
};

export default ProtectedRoute;
