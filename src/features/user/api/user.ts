import apiClient from '@/api/client';
import { Result } from '@/api/types';
import { UserDTO, UserEditableDTO } from '../types';

export const getUser = async (username: string): Promise<UserDTO> => {
  const response = await apiClient.get<Result<UserDTO>>(`/users/${username}`);
  return response.data.data as UserDTO;
};

export const updateUser = async (userData: UserEditableDTO): Promise<UserDTO> => {
  const response = await apiClient.put<Result<UserDTO>>('/user/self', userData);
  return response.data.data as UserDTO;
};

export const deleteUser = async (): Promise<void> => {
  await apiClient.delete('/user/self');
};
