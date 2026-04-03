import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="text-3xl font-bold text-brand-primary mb-8">
        Auction System
      </Link>
      <RegisterForm />
      <p className="mt-4 text-brand-neutral">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-secondary font-bold hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
