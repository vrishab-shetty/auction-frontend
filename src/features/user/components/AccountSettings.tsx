import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { deleteUser } from '../api/user';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Result } from '@/api/types';

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

  const errorMessage = (() => {
    if (!mutation.isError) return null;
    if (isAxiosError(mutation.error)) {
      const data = mutation.error.response?.data as Result<unknown> | undefined;
      if (data?.errorCode === 'USER_HAS_ACTIVE_AUCTIONS') {
        return 'Cannot delete account while you have active or scheduled auctions. Please wait for them to end or cancel them first.';
      }
    }
    return 'Something went wrong while deleting your account. Please try again.';
  })();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      mutation.mutate();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full mt-6 border-red-200 border">
      <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
      <p className="mb-4 text-gray-700">Once you delete your account, there is no going back. Please be certain.</p>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

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
