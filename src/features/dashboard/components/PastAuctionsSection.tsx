import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dashboardService from '../api/dashboardService';
import { AuctionCard } from './AuctionCard';
import { History } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export const PastAuctionsSection: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const size = 3;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['pastAuctions', page],
    queryFn: () => dashboardService.getPastAuctions(page, size),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data && page < data.totalPages - 1) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ['pastAuctions', nextPage],
        queryFn: () => dashboardService.getPastAuctions(nextPage, size),
      });
    }
  }, [data, page, queryClient]);

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader 
        title="Auction Archive"
        subtitle="Review completed events and final winning bids."
        icon={History}
        iconColorClass="text-gray-500"
        iconBgColorClass="bg-gray-100"
        isFetching={isFetching}
        pagination={{
          currentPage: page,
          totalPages: data?.totalPages || 0,
          onPageChange: setPage
        }}
      />

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 grayscale transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
        {data.content.map((auction) => (
          <div key={auction.id} className="relative group">
            <AuctionCard auction={auction} />
            <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
