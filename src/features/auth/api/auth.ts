import apiClient from '@/api/client';
import { Result } from '@/api/types';
import { UserEditableDTO } from '@/features/user/types';
import { User } from '@/store/authStore';

export interface LoginResponse {
  token: string;
  userInfo: User;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<Result<LoginResponse>>('/users/login', {}, {
    auth: {
      username,
      password,
    },
  });
  return response.data.data as LoginResponse;
};

export const register = async (userData: UserEditableDTO): Promise<unknown> => {
  const response = await apiClient.post<Result<unknown>>('/users', userData);
  return response.data.data;
};
