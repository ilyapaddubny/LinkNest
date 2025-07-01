'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { formatRelativeTime, extractDomain } from '@/lib/utils';
import { useInfiniteBookmarks, useDeleteBookmark } from '@/hooks';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';

export default function InfiniteBookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch bookmarks with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBookmarks({
    search: debouncedSearch,
    tag: selectedTag,
    limit: 20,
  });

  // Delete bookmark mutation
  const deleteBookmark = useDeleteBookmark();

  // Trigger next page fetch when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const bookmarks = data?.pages.flatMap((page) => page.data) || [];
  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags))).sort();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        await deleteBookmark.mutateAsync(id);
        toast.success('Bookmark deleted successfully');
      } catch {
        toast.error('Failed to delete bookmark');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bookmarks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {!isLoading && (
              <>
                {bookmarks.length} bookmark
                {bookmarks.length !== 1 ? 's' : ''} loaded
              </>
            )}
          </p>
        </div>
        <Link href="/bookmarks/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Bookmark
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by tag
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedTag === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTag('')}
                    >
                      All
                    </Button>
                    {allTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>
                Failed to load bookmarks: {error?.message || 'Unknown error'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bookmarks Grid */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {bookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3">
                        {bookmark.favicon ? (
                          <img
                            src={bookmark.favicon}
                            alt=""
                            className="h-6 w-6 rounded-sm flex-shrink-0 mt-0.5"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Bookmark className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {bookmark.title || bookmark.url}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {extractDomain(bookmark.url)}
                          </p>
                        </div>
                      </div>

                      {bookmark.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                          {bookmark.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {bookmark.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(bookmark.createdAt)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {bookmark.isPublic && (
                            <Share2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Visit
                    </a>
                    <div className="flex items-center space-x-2">
                      <Link href={`/bookmarks/${bookmark.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(bookmark.id)}
                        disabled={deleteBookmark.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load more trigger */}
          <div ref={ref} className="flex justify-center py-4">
            {isFetchingNextPage && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more bookmarks...</span>
              </div>
            )}
            {!hasNextPage && bookmarks.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                No more bookmarks to load
              </p>
            )}
          </div>
        </>
      )}

      {!isLoading && !isError && bookmarks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No bookmarks found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchQuery || selectedTag
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first bookmark.'}
            </p>
            <div className="mt-6">
              <Link href="/bookmarks/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bookmark
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
