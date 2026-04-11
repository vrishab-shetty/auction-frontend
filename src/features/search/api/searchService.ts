import apiClient from '@/api/client';
import { Result, PageResponse, ItemDTO } from '@/api/types';

const searchService = {
  searchItems: async (
    query?: string,
    location?: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<ItemDTO>> => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    params.append('pageNum', (page + 1).toString());
    params.append('pageSize', size.toString());

    const response = await apiClient.get<Result<PageResponse<ItemDTO>>>(
      `/items?${params.toString()}`
    );
    return response.data.data!;
  },
};

export default searchService;
