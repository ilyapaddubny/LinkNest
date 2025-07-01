import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { BookmarkQueryInput } from '@/lib/validations/bookmark';

export function useBookmarks(filters?: BookmarkQueryInput) {
  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => bookmarkApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}