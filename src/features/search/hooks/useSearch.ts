import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import searchService from '../api/searchService';
import { useDebounce } from '@/hooks/useDebounce';
import { ItemDTO } from '@/api/types';

export const useSearch = (pageSize = 12) => {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);

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
    if (newParams.q !== undefined) {
      setQuery(newParams.q);
      setPage(0); // Reset to first page on new query
    }
    
    if (newParams.loc !== undefined) {
      setLocation(newParams.loc);
      setPage(0); // Reset to first page on new location
    }

    if (newParams.page !== undefined) {
      setPage(newParams.page);
    }
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
