import { useInfiniteQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { BookmarkQueryInput } from '@/lib/validations/bookmark';

export function useInfiniteBookmarks(filters?: Omit<BookmarkQueryInput, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.infiniteList(filters),
    queryFn: ({ pageParam }) => 
      bookmarkApi.list({
        limit: 20,
        ...filters,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
    getPreviousPageParam: () => undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}