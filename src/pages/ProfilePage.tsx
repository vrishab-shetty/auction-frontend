import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/features/user/api/user';
import { useAuthStore } from '@/store/authStore';
import { ProfileEditor } from '@/features/user/components/ProfileEditor';
import { PersonalDetails } from '@/features/user/components/PersonalDetails';
import { BillingDashboard } from '@/features/user/components/BillingDashboard';
import { PaymentMethodEditor } from '@/features/user/components/PaymentMethodEditor';
import { AccountSettings } from '@/features/user/components/AccountSettings';
import { ChangePasswordForm } from '@/features/user/components/ChangePasswordForm';
import { User, CreditCard, Settings, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/features/core/components/Navbar';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'settings'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ['user', user?.username],
    queryFn: () => getUser(user!.username),
    enabled: !!user?.username,
  });

  if (!user) {
    return null; // App.tsx handles redirection
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center">
        <p className="text-xl text-brand-primary animate-pulse font-bold">Loading your profile...</p>
      </div>
    );
  }

  // Source of truth for display name: prefer freshly fetched userData, fallback to store user
  const displayName = userData?.name || user.name;
  const displayUsername = userData?.username || user.username;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-secondary border-4 border-brand-white">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-bold text-brand-primary">{displayName}</h2>
            <p className="text-brand-neutral font-medium">{displayUsername}</p>
          </div>

          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => { setActiveTab('profile'); setIsEditingProfile(false); }}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 font-semibold border-l-4 transition-all ${
                activeTab === 'profile' 
                  ? 'border-brand-secondary text-brand-primary bg-gray-50' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              <User size={20} />
              <span>Profile Information</span>
            </button>
            <button 
              onClick={() => { setActiveTab('billing'); setIsAddingPayment(false); }}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 font-semibold border-l-4 transition-all ${
                activeTab === 'billing' 
                  ? 'border-brand-secondary text-brand-primary bg-gray-50' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              <CreditCard size={20} />
              <span>Billing & Payments</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 font-semibold border-l-4 transition-all ${
                activeTab === 'settings' 
                  ? 'border-brand-secondary text-brand-primary bg-gray-50' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Settings size={20} />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-secondary/20 p-2 rounded-lg text-brand-secondary">
                    <User size={24} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-brand-primary">
                    {isEditingProfile ? 'Edit Profile' : 'Profile Information'}
                  </h2>
                </div>
                {isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="flex items-center gap-2 text-brand-neutral hover:text-brand-primary font-bold transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>Back to Details</span>
                  </button>
                )}
              </div>
              
              <p className="text-brand-neutral mb-8">
                {isEditingProfile 
                  ? 'Update your personal information and contact details below.' 
                  : 'Manage your personal details and how others see you on the platform.'}
              </p>

              {isError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                  <p className="text-red-700">Failed to load extended profile data. Some information may be missing.</p>
                </div>
              )}

              {userData ? (
                isEditingProfile ? (
                  <ProfileEditor user={userData} onSuccess={() => setIsEditingProfile(false)} />
                ) : (
                  <PersonalDetails user={userData} onEdit={() => setIsEditingProfile(true)} />
                )
              ) : (
                !isLoading && !isError && <p className="text-gray-500 italic">No detailed profile information available.</p>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-secondary/20 p-2 rounded-lg text-brand-secondary">
                    <CreditCard size={24} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-brand-primary">
                    {isAddingPayment ? 'Add Payment Method' : 'Billing & Payments'}
                  </h2>
                </div>
                {isAddingPayment && (
                  <button 
                    onClick={() => setIsAddingPayment(false)}
                    className="flex items-center gap-2 text-brand-neutral hover:text-brand-primary font-bold transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>Back to Methods</span>
                  </button>
                )}
              </div>
              
              <p className="text-brand-neutral mb-8">
                {isAddingPayment 
                  ? 'Securely add a new credit card or bank account to your profile.' 
                  : 'Manage your saved payment methods and choose your default for bidding.'}
              </p>

              {isAddingPayment ? (
                <PaymentMethodEditor onClose={() => setIsAddingPayment(false)} />
              ) : (
                <BillingDashboard onAddClick={() => setIsAddingPayment(true)} />
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-brand-secondary/20 p-2 rounded-lg text-brand-secondary">
                    <ShieldCheck size={24} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-brand-primary">Security Settings</h2>
                </div>
                <p className="text-brand-neutral mb-8">Update your password and manage security preferences.</p>
                <ChangePasswordForm />
              </section>

              <section className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-50 p-2 rounded-lg text-red-600">
                    <Settings size={24} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-red-600">Account Deletion</h2>
                </div>
                <p className="text-brand-neutral mb-8">Review your account status and permanent actions.</p>
                <AccountSettings />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
