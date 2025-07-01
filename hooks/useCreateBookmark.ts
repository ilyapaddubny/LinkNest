import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi, type Bookmark } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { CreateBookmarkInput } from '@/lib/validations/bookmark';

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmarkInput) => bookmarkApi.create(data),
    
    onMutate: async (newBookmark) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      
      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueriesData({ queryKey: queryKeys.all });
      
      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: queryKeys.all },
        (old: any) => {
          if (!old) return old;
          
          // Create temporary bookmark with optimistic data
          const tempBookmark: Bookmark = {
            id: `temp-${Date.now()}`,
            url: newBookmark.url,
            title: newBookmark.title || newBookmark.url,
            description: newBookmark.description || null,
            image: null,
            favicon: null,
            isPublic: newBookmark.isPublic || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: newBookmark.tags || [],
          };
          
          return {
            ...old,
            data: [tempBookmark, ...(old.data || [])],
          };
        }
      );
      
      // Return a context object with the snapshotted value
      return { previousBookmarks };
    },
    
    onError: (err, newBookmark, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
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