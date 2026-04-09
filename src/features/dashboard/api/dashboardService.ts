import apiClient from '@/api/client';
import { Result, PageResponse } from '@/api/types';
import { AuctionDTO, AuctionItemDTO } from '@/features/auctions/types';

const dashboardService = {
  getActiveAuctions: async (page = 0, size = 3): Promise<PageResponse<AuctionDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionDTO>>>(
      `/auctions?active=true&pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },

  getPopularItems: async (page = 0, size = 3): Promise<PageResponse<AuctionItemDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionItemDTO>>>(
      `/items/popular?pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },

  getPastAuctions: async (page = 0, size = 3): Promise<PageResponse<AuctionDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionDTO>>>(
      `/auctions?active=false&pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },
};

export default dashboardService;
