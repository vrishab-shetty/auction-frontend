import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useAuthStore } from '@/store/authStore';
import { extractFieldErrors } from '@/utils/errorUtils';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data) => {
      // Assuming data contains { token: string, userInfo: User }
      setAuth(data.userInfo, data.token);
      navigate('/profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4 text-brand-primary">Login</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="w-full border p-2 rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-brand-primary text-brand-white p-2 rounded hover:opacity-90"
      >
        {mutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
