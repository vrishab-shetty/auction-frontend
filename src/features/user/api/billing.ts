import apiClient from '@/api/client';
import { Result } from '@/api/types';
import { BillingDetails } from '../types';

export const getBillingDetails = async (): Promise<BillingDetails[]> => {
  const response = await apiClient.get<Result<BillingDetails[]>>('/user/self/billingDetails');
  return response.data.data as BillingDetails[];
};

export const updateBillingDetails = async (billingDetails: Omit<BillingDetails, 'id'>): Promise<void> => {
  await apiClient.put<Result<void>>('/user/self/billingDetails', billingDetails);
};

export const deleteBillingDetails = async (id: string): Promise<void> => {
  await apiClient.delete<Result<void>>(`/user/self/billingDetails/${id}`);
};
