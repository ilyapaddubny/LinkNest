import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateBookmarkInput } from '@/lib/validations/bookmark';

export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookmarkInput }) =>
      bookmarkApi.update(id, data),
    
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      
      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueriesData({ queryKey: queryKeys.all });
      
      // Optimistically update the bookmark
      queryClient.setQueriesData(
        { queryKey: queryKeys.all },
        (old: any) => {
          if (!old) return old;
          
          return {
            ...old,
            data: old.data.map((bookmark: any) =>
              bookmark.id === id
                ? {
                    ...bookmark,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  }
                : bookmark
            ),
          };
        }
      );
      
      return { previousBookmarks };
    },
    
    onError: (err, variables, context) => {
      // Roll back on error
      if (context?.previousBookmarks) {
        context.previousBookmarks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}