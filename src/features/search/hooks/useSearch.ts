import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import searchService from '../api/searchService';
import { useDebounce } from '@/hooks/useDebounce';

export const useSearch = (pageSize = 12) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const query = searchParams.get('q') || '';
  const location = searchParams.get('loc') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const debouncedQuery = useDebounce(query, 300);
  const debouncedLocation = useDebounce(location, 300);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['searchItems', debouncedQuery, debouncedLocation, page],
    queryFn: () => searchService.searchItems(debouncedQuery, debouncedLocation, page, pageSize),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
  });

  // Prefetch next page
  useEffect(() => {
    if (data && page < data.totalPages - 1) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ['searchItems', debouncedQuery, debouncedLocation, nextPage],
        queryFn: () => searchService.searchItems(debouncedQuery, debouncedLocation, nextPage, pageSize),
      });
    }
  }, [data, page, debouncedQuery, debouncedLocation, queryClient, pageSize]);

  const updateSearch = (newParams: { q?: string; loc?: string; page?: number }) => {
    const nextParams = new URLSearchParams(searchParams);
    
    if (newParams.q !== undefined) {
      if (newParams.q) nextParams.set('q', newParams.q);
      else nextParams.delete('q');
      nextParams.set('page', '0'); // Reset to first page on new query
    }
    
    if (newParams.loc !== undefined) {
      if (newParams.loc) nextParams.set('loc', newParams.loc);
      else nextParams.delete('loc');
      nextParams.set('page', '0'); // Reset to first page on new location
    }

    if (newParams.page !== undefined) {
      nextParams.set('page', newParams.page.toString());
    }

    setSearchParams(nextParams);
  };

  return {
    items: data?.content || [],
    pagination: {
      totalElements: data?.totalElements || 0,
      totalPages: data?.totalPages || 0,
      isFirst: data?.isFirst ?? true,
      isLast: data?.isLast ?? true,
      currentPage: page,
    },
    filters: {
      query,
      location,
    },
    isLoading: isLoading && !data,
    isFetching,
    isError,
    updateSearch,
  };
};
