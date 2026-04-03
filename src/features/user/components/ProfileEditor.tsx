import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../api/user';
import { UserDTO, UserEditableDTO } from '../types';
import { extractFieldErrors } from '@/utils/errorUtils';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface ProfileEditorProps {
  user: UserDTO;
  onSuccess?: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSuccess }) => {
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser: updateGlobalUser } = useAuthStore();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<UserEditableDTO>({
    name: user.name,
    description: user.description || '',
    email: user.username, 
    contact: user.contact,
    zipCode: user.homeAddress?.zipcode || '',
    street: user.homeAddress?.street || '',
    city: user.homeAddress?.city || '',
    country: user.homeAddress?.country || '',
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      description: user.description || '',
      email: user.username,
      contact: user.contact,
      zipCode: user.homeAddress?.zipcode || '',
      street: user.homeAddress?.street || '',
      city: user.homeAddress?.city || '',
      country: user.homeAddress?.country || '',
    });
  }, [user]);

  const mutation = useMutation({
    mutationFn: (data: UserEditableDTO) => updateUser(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      if (currentUser) {
        updateGlobalUser({
          ...currentUser,
          name: updatedUser.name,
          username: updatedUser.username,
        });
      }

      alert('Profile updated successfully');
      if (onSuccess) onSuccess();
    },
  });

  // Automatically scroll to the first error message when a submission error occurs
  useEffect(() => {
    if (mutation.isError && formRef.current) {
      // Look for field errors first, then the general error banner
      const firstError = formRef.current.querySelector('[class*="text-red-500"], .error-banner');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [mutation.isError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, ...rest } = formData;
    mutation.mutate({ ...rest, email }); 
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {errors.general && (
        <div className="error-banner bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <p className="text-red-700 font-medium">{errors.general}</p>
        </div>
      )}

      {/* Account Basics Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
          <User className="text-brand-secondary" size={20} />
          <h3 className="text-lg font-bold text-brand-primary">Account Basics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="name" 
                type="text" 
                className={`w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Email Address (Read Only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="email" 
                type="email" 
                className="w-full border border-gray-100 bg-gray-50 pl-10 p-3 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                value={formData.email} 
                readOnly 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="contact" 
                type="text" 
                className={`w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                value={formData.contact} 
                onChange={handleChange} 
                required 
              />
            </div>
            {errors.contact && <p className="text-red-500 text-xs font-medium">{errors.contact}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Bio / Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
            <textarea 
              name="description" 
              rows={3}
              className={`w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>
          {errors.description && <p className="text-red-500 text-xs font-medium">{errors.description}</p>}
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
          <MapPin className="text-brand-secondary" size={20} />
          <h3 className="text-lg font-bold text-brand-primary">Home Address</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Street Address</label>
            <input 
              name="street" 
              type="text" 
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.street ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.street} 
              onChange={handleChange} 
              required 
            />
            {errors.street && <p className="text-red-500 text-xs font-medium">{errors.street}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">City</label>
            <input 
              name="city" 
              type="text" 
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.city} 
              onChange={handleChange} 
              required 
            />
            {errors.city && <p className="text-red-500 text-xs font-medium">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Country</label>
            <input 
              name="country" 
              type="text" 
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.country ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.country} 
              onChange={handleChange} 
              required 
            />
            {errors.country && <p className="text-red-500 text-xs font-medium">{errors.country}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Zip / Postal Code</label>
            <input 
              name="zipCode" 
              type="text" 
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={formData.zipCode} 
              onChange={handleChange} 
              required 
            />
            {errors.zipCode && <p className="text-red-500 text-xs font-medium">{errors.zipCode}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-brand-primary text-brand-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {mutation.isPending ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </div>
    </form>
  );
};
