import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Result, PageResponse } from '@/api/types';

export const useAuctions = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['auctions', page, size],
    queryFn: async () => {
      const response = await apiClient.get<Result<PageResponse<any>>>(`/auctions?page=${page}&size=${size}`);
      return response.data.data;
    },
  });
};
