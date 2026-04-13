import { useQuery } from '@tanstack/react-query';
import { getMyAuctions } from '@/features/user/api/user';

export const useMyAuctions = () => {
  return useQuery({
    queryKey: ['my-auctions'],
    queryFn: getMyAuctions,
  });
};
