import apiClient from '@/api/client';
import { Result, PageResponse } from '@/api/types';
import { AuctionDTO } from '../types';

const auctionService = {
  getAuctions: async (page = 0, size = 10): Promise<PageResponse<AuctionDTO>> => {
    const response = await apiClient.get<Result<PageResponse<AuctionDTO>>>(
      `/auctions?pageNum=${page + 1}&pageSize=${size}`
    );
    return response.data.data!;
  },

  getAuctionById: async (id: string): Promise<AuctionDTO> => {
    const response = await apiClient.get<Result<AuctionDTO>>(`/auctions/${id}`);
    return response.data.data!;
  },
};

export default auctionService;
