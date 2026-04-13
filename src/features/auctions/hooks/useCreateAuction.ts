import { useMutation, useQueryClient } from '@tanstack/react-query';
import auctionService from '../api/auctionService';
import { AuctionCreationDTO } from '../types';
import { useNavigate } from 'react-router-dom';

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AuctionCreationDTO) => auctionService.addAuction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] });
      alert('Auction created successfully!');
      navigate('/my-auctions');
    },
  });
};
