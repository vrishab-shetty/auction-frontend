import { useQuery } from '@tanstack/react-query';
import auctionService from '../api/auctionService';

export const useItemDetails = (itemId: string) => {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: () => auctionService.getItemById(itemId),
    enabled: !!itemId,
  });
};
