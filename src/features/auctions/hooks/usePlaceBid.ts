import { useMutation, useQueryClient } from '@tanstack/react-query';
import auctionService from '../api/auctionService';
import { ItemDTO } from '@/api/types';

interface PlaceBidParams {
  auctionId: string;
  itemId: string;
  bidAmount: number;
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionId, itemId, bidAmount }: PlaceBidParams) => 
      auctionService.placeBid(auctionId, itemId, bidAmount),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(['item', updatedItem.id], (oldItem: ItemDTO | undefined) => ({
        ...oldItem,
        ...updatedItem
      }));
    },
  });
};
