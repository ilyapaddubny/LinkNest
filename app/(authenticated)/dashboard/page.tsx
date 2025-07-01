import { auth } from '@/lib/auth';
import {
  Plus,
  Bookmark,
  Tag,
  Share2,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

const stats = [
  {
    name: 'Total Bookmarks',
    value: '247',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Bookmark,
  },
  {
    name: 'Tags Used',
    value: '23',
    change: '+3',
    changeType: 'positive' as const,
    icon: Tag,
  },
  {
    name: 'Shared Links',
    value: '8',
    change: '+2',
    changeType: 'positive' as const,
    icon: Share2,
  },
  {
    name: 'This Week',
    value: '18',
    change: '+5%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
];

const recentBookmarks = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js',
    url: 'https://nextjs.org/docs',
    description: 'The React Framework for Production',
    tags: ['nextjs', 'react', 'development'],
    createdAt: '2024-01-01T10:00:00Z',
    favicon: '🚀',
  },
  {
    id: '2',
    title: 'Tailwind CSS Documentation',
    url: 'https://tailwindcss.com/docs',
    description: 'A utility-first CSS framework for rapid UI development',
    tags: ['css', 'design', 'framework'],
    createdAt: '2024-01-01T09:30:00Z',
    favicon: '🎨',
  },
  {
    id: '3',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'TypeScript extends JavaScript by adding types',
    tags: ['typescript', 'javascript', 'programming'],
    createdAt: '2024-01-01T08:15:00Z',
    favicon: '📚',
  },
];

const quickActions = [
  {
    name: 'Add Bookmark',
    description: 'Save a new link to your collection',
    href: '/bookmarks/new',
    icon: Plus,
    color: 'bg-primary-500',
  },
  {
    name: 'Browse All',
    description: 'View and search all your bookmarks',
    href: '/bookmarks',
    icon: Bookmark,
    color: 'bg-blue-500',
  },
  {
    name: 'Popular Tags',
    description: 'See your most used tags',
    href: '/tags',
    icon: Tag,
    color: 'bg-green-500',
  },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your bookmarks today.
          </p>
        </div>
        <Link href="/bookmarks/new">
          <Button size="lg" className="px-6">
            <Plus className="mr-2 h-5 w-5" />
            Add Bookmark
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your bookmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="block rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={`rounded-lg p-2 ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {action.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookmarks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookmarks</CardTitle>
                <CardDescription>Your latest saved links</CardDescription>
              </div>
              <Link href="/bookmarks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                        {bookmark.favicon}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {bookmark.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {bookmark.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(bookmark.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-1">
                          {bookmark.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {bookmark.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{bookmark.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
