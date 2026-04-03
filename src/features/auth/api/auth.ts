import apiClient from '@/api/client';
import { Result } from '@/api/types';
import { UserEditableDTO } from '@/features/user/types';

export const login = async (username: string, password: string): Promise<any> => {
  const token = btoa(`${username}:${password}`);
  const response = await apiClient.post<Result<any>>('/users/login', {}, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  return response.data.data;
};

export const register = async (userData: UserEditableDTO): Promise<any> => {
  const response = await apiClient.post<Result<any>>('/users', userData);
  return response.data.data;
};
