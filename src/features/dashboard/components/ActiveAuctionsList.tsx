import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dashboardService from '../api/dashboardService';
import { AuctionCard } from './AuctionCard';
import { ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';

export const ActiveAuctionsList: React.FC = () => {
  const [page, setPage] = useState(0);
  const size = 3;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['activeAuctions', page],
    queryFn: () => dashboardService.getActiveAuctions(page, size),
  });

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
    <div className="space-y-8 relative">
      {/* Subtle fetching indicator */}
      {isFetching && (
        <div className="absolute -top-10 right-0 flex items-center gap-2 text-brand-secondary font-bold text-xs animate-pulse">
          <Loader2 size={14} className="animate-spin" />
          Updating Feed...
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
        {data?.content.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isFetching}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold text-brand-primary uppercase tracking-widest">
            Page {page + 1} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1 || isFetching}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
