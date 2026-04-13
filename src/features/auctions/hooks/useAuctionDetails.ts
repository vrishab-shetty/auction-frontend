import { useQuery } from '@tanstack/react-query';
import auctionService from '../api/auctionService';

export const useAuctionDetails = (auctionId: string) => {
  return useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => auctionService.getAuctionById(auctionId),
    enabled: !!auctionId,
  });
};
