import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dashboardService from '../api/dashboardService';
import { ItemCard } from '@/components/ItemCard';
import { ChevronLeft, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';

export const PopularItemsGallery: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const size = 3;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['popularItems', page],
    queryFn: () => dashboardService.getPopularItems(page, size),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  // Strategy 2: Interaction-Based Prefetching
  const prefetchPage = (targetPage: number) => {
    if (targetPage >= 0 && data && targetPage < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['popularItems', targetPage],
        queryFn: () => dashboardService.getPopularItems(targetPage, size),
      });
    }
  };

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || (!data && !isLoading) || (data && data.content.length === 0)) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-2">
        <p className="text-brand-neutral font-medium">No popular items to display right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-brand-secondary" size={20} />
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Trending Now</h3>
          {isFetching && <Loader2 size={14} className="animate-spin text-brand-secondary ml-2" />}
        </div>
        
        {data && data.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              onMouseEnter={() => prefetchPage(page - 1)}
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
              onMouseEnter={() => prefetchPage(page + 1)}
              disabled={page >= data.totalPages - 1 || isFetching}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
        {data?.content.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
