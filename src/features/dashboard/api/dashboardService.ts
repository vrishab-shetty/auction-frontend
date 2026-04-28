import apiClient from '@/api/client';
import { Result, PageResponse } from '@/api/types';
import { AuctionDTO } from '@/features/auctions/types';

const dashboardService = {
  getActiveAuctions: async (page = 0, size = 3): Promise<PageResponse<AuctionDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionDTO>>>(
      `/auctions?status=ACTIVE&pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },

  getScheduledAuctions: async (page = 0, size = 3): Promise<PageResponse<AuctionDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionDTO>>>(
      `/auctions?status=SCHEDULED&pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },

  getPastAuctions: async (page = 0, size = 3): Promise<PageResponse<AuctionDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionDTO>>>(
      `/auctions?status=ENDED&pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },
};

export default dashboardService;
