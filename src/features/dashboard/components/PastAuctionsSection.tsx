import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dashboardService from '../api/dashboardService';
import { AuctionCard } from './AuctionCard';
import { ChevronLeft, ChevronRight, History, Loader2 } from 'lucide-react';

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

  // Strategy 1: Reactive Background Prefetching
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
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <History className="text-brand-neutral" size={20} />
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Auction Archive</h3>
          {isFetching && <Loader2 size={14} className="animate-spin text-brand-neutral ml-2" />}
        </div>
        
        {data.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isFetching}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-brand-primary uppercase px-2">
              {page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
              disabled={page >= data.totalPages - 1 || isFetching}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 grayscale transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
        {data.content.map((auction) => (
          <div key={auction.id} className="relative group">
            <AuctionCard auction={auction} />
            {/* Overlay to indicate non-active state */}
            <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
