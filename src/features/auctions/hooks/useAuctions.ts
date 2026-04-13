import { useQuery } from '@tanstack/react-query';
import auctionService from '../api/auctionService';

export const useAuctions = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['auctions', page, size],
    queryFn: () => auctionService.getAuctions(page, size),
  });
};
