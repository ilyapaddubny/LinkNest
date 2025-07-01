import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useBookmark(id: string) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => bookmarkApi.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}