'use client';

import { useState } from 'react';
import { Search, Filter, Plus, ExternalLink, Edit, Trash2, Share2, Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { formatRelativeTime, extractDomain } from '@/lib/utils';

// Mock data - this would come from the API in a real app
const mockBookmarks = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js',
    url: 'https://nextjs.org/docs',
    description: 'The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production.',
    tags: ['nextjs', 'react', 'development', 'frontend'],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    isPublic: false,
    isFavorite: true,
    ogImage: 'https://nextjs.org/static/blog/next-13/twitter-card.png',
    favicon: 'https://nextjs.org/favicon.ico',
  },
  {
    id: '2',
    title: 'Tailwind CSS Documentation',
    url: 'https://tailwindcss.com/docs',
    description: 'A utility-first CSS framework packed with classes to build any design, directly in your markup.',
    tags: ['css', 'design', 'framework', 'styling'],
    createdAt: '2024-01-01T09:30:00Z',
    updatedAt: '2024-01-01T09:30:00Z',
    isPublic: true,
    isFavorite: false,
    ogImage: 'https://tailwindcss.com/_next/static/media/twitter-large-card.85c0ff9e.jpg',
    favicon: 'https://tailwindcss.com/favicon-32x32.png',
  },
  {
    id: '3',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'TypeScript extends JavaScript by adding types to the language.',
    tags: ['typescript', 'javascript', 'programming', 'documentation'],
    createdAt: '2024-01-01T08:15:00Z',
    updatedAt: '2024-01-01T08:15:00Z',
    isPublic: false,
    isFavorite: true,
    ogImage: 'https://www.typescriptlang.org/images/branding/ts-logo-512.png',
    favicon: 'https://www.typescriptlang.org/favicon-32x32.png',
  },
];

const allTags = Array.from(new Set(mockBookmarks.flatMap(b => b.tags))).sort();

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBookmarks = mockBookmarks.filter((bookmark) => {
    const matchesSearch = !searchQuery || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = !selectedTag || bookmark.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bookmarks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''} found
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

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredBookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    {bookmark.favicon && (
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="h-6 w-6 rounded-sm flex-shrink-0 mt-0.5"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {bookmark.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {extractDomain(bookmark.url)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {bookmark.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(bookmark.createdAt)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {bookmark.isFavorite && (
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      )}
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
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
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