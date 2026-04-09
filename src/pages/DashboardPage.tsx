import React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <header className="bg-brand-primary text-brand-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <span className="bg-brand-secondary text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg">A</span>
              AUCTION
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-bold flex items-center gap-2 text-brand-secondary border-b-2 border-brand-secondary pb-1">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/profile" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Active User</span>
              <span className="text-sm font-bold">{user.name}</span>
            </div>
            <Link to="/profile" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
              <UserIcon size={20} />
            </Link>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10">
        <DashboardLayout />
      </main>
    </div>
  );
};

export default DashboardPage;
