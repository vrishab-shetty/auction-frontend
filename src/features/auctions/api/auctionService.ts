import apiClient from '@/api/client';
import { Result, PageResponse } from '@/api/types';
import { AuctionDTO, AuctionUpdateDTO, AuctionCreationDTO } from '../types';

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

  updateAuction: async (id: string, data: AuctionUpdateDTO): Promise<AuctionDTO> => {
    const response = await apiClient.put<Result<AuctionDTO>>(`/auctions/${id}`, data);
    return response.data.data!;
  },

  deleteAuction: async (id: string): Promise<void> => {
    await apiClient.delete<Result<void>>(`/auctions/${id}`);
  },

  addAuction: async (data: AuctionCreationDTO): Promise<AuctionDTO> => {
    const response = await apiClient.post<Result<AuctionDTO>>('/auctions', data);
    return response.data.data!;
  },
};

export default auctionService;
