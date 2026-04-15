import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dashboardService from '../api/dashboardService';
import { ItemCard } from '@/components/ItemCard';
import { TrendingUp } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

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
    <div>
      <SectionHeader 
        title="Trending Now"
        subtitle="Discover items with the highest bidding activity and engagement."
        icon={TrendingUp}
        iconColorClass="text-brand-primary"
        iconBgColorClass="bg-brand-secondary"
        isFetching={isFetching}
        pagination={{
          currentPage: page,
          totalPages: data?.totalPages || 0,
          onPageChange: setPage,
          onPrefetch: prefetchPage
        }}
      />

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
        {data?.content.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
