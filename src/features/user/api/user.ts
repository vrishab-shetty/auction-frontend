import apiClient from '@/api/client';
import { Result } from '@/api/types';
import { UserDTO, UserUpdateDTO, ChangePasswordDTO } from '../types';

export const getUser = async (username: string): Promise<UserDTO> => {
  const response = await apiClient.get<Result<UserDTO>>(`/users/${username}`);
  return response.data.data as UserDTO;
};

export const updateUser = async (userData: UserUpdateDTO): Promise<UserDTO> => {
  const response = await apiClient.put<Result<UserDTO>>('/user/self', userData);
  return response.data.data as UserDTO;
};

export const changePassword = async (passwordData: ChangePasswordDTO): Promise<void> => {
  await apiClient.put('/user/self/password', passwordData);
};

export const deleteUser = async (): Promise<void> => {
  await apiClient.delete('/user/self');
};
