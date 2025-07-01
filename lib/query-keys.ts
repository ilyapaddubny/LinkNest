import type { BookmarkQueryInput } from '@/lib/validations/bookmark';

export const queryKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters?: BookmarkQueryInput) =>
    [...queryKeys.lists(), filters] as const,
  infiniteLists: () => [...queryKeys.all, 'infinite'] as const,
  infiniteList: (filters?: Omit<BookmarkQueryInput, 'cursor'>) =>
    [...queryKeys.infiniteLists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
} as const;
