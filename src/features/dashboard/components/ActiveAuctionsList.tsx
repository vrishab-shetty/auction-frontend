import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dashboardService from '../api/dashboardService';
import { AuctionCard } from './AuctionCard';
import { Activity, Inbox } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export const ActiveAuctionsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const size = 3;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['activeAuctions', page],
    queryFn: () => dashboardService.getActiveAuctions(page, size),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      const savedScrollPos = sessionStorage.getItem('dashboard-scroll');
      if (savedScrollPos) {
        const timeoutId = setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPos, 10));
          sessionStorage.removeItem('dashboard-scroll');
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [data, isLoading, isFetching]);

  useEffect(() => {
    if (data && page < data.totalPages - 1) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ['activeAuctions', nextPage],
        queryFn: () => dashboardService.getActiveAuctions(nextPage, size),
      });
    }
  }, [data, page, queryClient]);

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || (!data && !isLoading) || (data && data.content.length === 0)) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center space-y-4">
        <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-gray-400 shadow-sm">
          <Inbox size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-primary">No Active Auctions</h3>
          <p className="text-brand-neutral max-w-xs mx-auto">There are currently no live auctions. Check back later or explore popular items.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader 
        title="Live Auctions"
        subtitle="Bidding is active. Join now to secure your exclusive items."
        icon={Activity}
        iconColorClass="text-brand-white"
        iconBgColorClass="bg-brand-primary"
        isFetching={isFetching}
        pagination={{
          currentPage: page,
          totalPages: data?.totalPages || 0,
          onPageChange: setPage
        }}
      />

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
        {data?.content.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};
