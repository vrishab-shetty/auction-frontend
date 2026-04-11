import React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10">
        <DashboardLayout />
      </main>
    </div>
  );
};

export default DashboardPage;
