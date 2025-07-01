import { notFound } from 'next/navigation';
import { ExternalLink, Calendar, Tag, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, extractDomain } from '@/lib/utils';

// Mock data - this would come from the API in a real app
const mockUser = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Frontend developer passionate about modern web technologies',
  avatar: null,
  joinedAt: '2024-01-01T00:00:00Z',
  bookmarkCount: 247,
  publicBookmarkCount: 42,
};

const mockPublicBookmarks = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js',
    url: 'https://nextjs.org/docs',
    description: 'The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production.',
    tags: ['nextjs', 'react', 'development', 'frontend'],
    createdAt: '2024-01-01T10:00:00Z',
    favicon: 'https://nextjs.org/favicon.ico',
  },
  {
    id: '2',
    title: 'Tailwind CSS Documentation',
    url: 'https://tailwindcss.com/docs',
    description: 'A utility-first CSS framework packed with classes to build any design, directly in your markup.',
    tags: ['css', 'design', 'framework', 'styling'],
    createdAt: '2024-01-01T09:30:00Z',
    favicon: 'https://tailwindcss.com/favicon-32x32.png',
  },
  {
    id: '3',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'TypeScript extends JavaScript by adding types to the language.',
    tags: ['typescript', 'javascript', 'programming', 'documentation'],
    createdAt: '2024-01-01T08:15:00Z',
    favicon: 'https://www.typescriptlang.org/favicon-32x32.png',
  },
];

interface PublicProfilePageProps {
  params: {
    username: string;
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = params;

  // In a real app, you would fetch the user and their public bookmarks from the API
  // For now, we'll use mock data and return 404 for unknown usernames
  if (username !== 'johndoe') {
    notFound();
  }

  const user = mockUser;
  const bookmarks = mockPublicBookmarks;
  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags))).sort();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900/20">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
              {user.bio && (
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {user.bio}
                </p>
              )}
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Joined {formatRelativeTime(user.joinedAt)}
                </div>
                <div>
                  {user.publicBookmarkCount} public bookmarks
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar with Tags */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Popular Tags
                </h2>
                <div className="space-y-2">
                  {allTags.slice(0, 10).map((tag) => {
                    const count = bookmarks.filter(b => b.tags.includes(tag)).length;
                    return (
                      <div key={tag} className="flex items-center justify-between">
                        <Badge variant="outline" className="flex-1 justify-start">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookmarks */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Public Bookmarks
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} shared publicly
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {bookmark.favicon && (
                        <img
                          src={bookmark.favicon}
                          alt=""
                          className="h-6 w-6 rounded-sm flex-shrink-0 mt-1"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                          {bookmark.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {extractDomain(bookmark.url)}
                        </p>
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
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Visit
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {bookmarks.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Share2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    No public bookmarks yet
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {user.name} hasn't shared any bookmarks publicly yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}