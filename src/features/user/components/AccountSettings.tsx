import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '../api/user';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export const AccountSettings: React.FC = () => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      logout();
      navigate('/');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      mutation.mutate();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full mt-6 border-red-200 border">
      <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
      <p className="mb-4 text-gray-700">Once you delete your account, there is no going back. Please be certain.</p>
      
      <button
        onClick={handleDelete}
        disabled={mutation.isPending}
        className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
      >
        {mutation.isPending ? 'Deleting...' : 'Delete Account'}
      </button>
    </div>
  );
};
