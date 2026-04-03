import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="text-3xl font-bold text-brand-primary mb-8">
        Auction System
      </Link>
      <LoginForm />
      <p className="mt-4 text-brand-neutral">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-secondary font-bold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
