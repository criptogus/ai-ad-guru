
import React from 'react';
import { Link } from 'react-router-dom';

const LoginFooter: React.FC = () => {
  return (
    <>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-600 hover:underline">
          Sign up
        </Link>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our{' '}
        <Link to="/terms" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </div>
    </>
  );
};

export default LoginFooter;
