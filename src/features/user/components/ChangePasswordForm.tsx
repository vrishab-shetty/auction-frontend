import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../api/user';
import { ChangePasswordDTO } from '../types';
import { extractFieldErrors } from '@/utils/errorUtils';
import { Lock, ShieldCheck } from 'lucide-react';

export const ChangePasswordForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<ChangePasswordDTO>({
    currentPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordDTO) => changePassword(data),
    onSuccess: () => {
      alert('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '' });
      setConfirmPassword('');
      setLocalError(null);
    },
  });

  // Automatically scroll to error
  useEffect(() => {
    if ((mutation.isError || localError) && formRef.current) {
      const firstError = formRef.current.querySelector('[class*="text-red-500"], .error-banner');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [mutation.isError, localError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.newPassword !== confirmPassword) {
      setLocalError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters');
      return;
    }

    mutation.mutate(formData);
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
        <ShieldCheck className="text-brand-secondary" size={20} />
        <h3 className="text-lg font-bold text-brand-primary">Security & Password</h3>
      </div>

      {(errors.general || localError) && (
        <div className="error-banner bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <p className="text-red-700 font-medium">{errors.general || localError}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="currentPassword" 
              type="password" 
              className={`w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.currentPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          {errors.currentPassword && <p className="text-red-500 text-xs font-medium">{errors.currentPassword}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="newPassword" 
              type="password" 
              className={`w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.newPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs font-medium">{errors.newPassword}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              className={`w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${localError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-brand-primary text-brand-white p-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
      >
        {mutation.isPending ? 'Updating Password...' : 'Update Password'}
      </button>
    </form>
  );
};
