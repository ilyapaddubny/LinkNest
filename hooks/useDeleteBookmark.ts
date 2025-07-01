import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookmarkApi.delete(id),
    
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      
      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueriesData({ queryKey: queryKeys.all });
      
      // Optimistically remove the bookmark
      queryClient.setQueriesData(
        { queryKey: queryKeys.all },
        (old: any) => {
          if (!old) return old;
          
          return {
            ...old,
            data: old.data.filter((bookmark: any) => bookmark.id !== deletedId),
          };
        }
      );
      
      return { previousBookmarks };
    },
    
    onError: (err, deletedId, context) => {
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