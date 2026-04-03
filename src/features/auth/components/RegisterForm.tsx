import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth';
import { UserEditableDTO } from '@/features/user/types';
import { extractFieldErrors } from '@/utils/errorUtils';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserEditableDTO>({
    name: '',
    password: '',
    description: '',
    email: '',
    contact: '',
    zipCode: '',
    street: '',
    city: '',
    country: '',
  });

  const mutation = useMutation({
    mutationFn: () => register(formData),
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-brand-primary">Register</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input name="name" type="text" className="w-full border p-2 rounded" value={formData.name} onChange={handleChange} required />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input name="email" type="email" className="w-full border p-2 rounded" value={formData.email} onChange={handleChange} required />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input name="password" type="password" className="w-full border p-2 rounded" value={formData.password} onChange={handleChange} required />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Contact</label>
          <input name="contact" type="text" className="w-full border p-2 rounded" value={formData.contact} onChange={handleChange} required />
          {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700">Description</label>
          <textarea name="description" className="w-full border p-2 rounded" value={formData.description} onChange={handleChange} required />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Street</label>
          <input name="street" type="text" className="w-full border p-2 rounded" value={formData.street} onChange={handleChange} required />
          {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
        </div>

        <div>
          <label className="block text-gray-700">City</label>
          <input name="city" type="text" className="w-full border p-2 rounded" value={formData.city} onChange={handleChange} required />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Country</label>
          <input name="country" type="text" className="w-full border p-2 rounded" value={formData.country} onChange={handleChange} required />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Zip Code</label>
          <input name="zipCode" type="text" className="w-full border p-2 rounded" value={formData.zipCode} onChange={handleChange} required />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-brand-primary text-brand-white p-2 rounded hover:opacity-90 mt-6"
      >
        {mutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
