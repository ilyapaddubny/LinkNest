'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Bookmark, 
  Plus, 
  Settings, 
  Tag, 
  Heart,
  Share2,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'All Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Add Bookmark', href: '/bookmarks/new', icon: Plus },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Shared', href: '/shared', icon: Share2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const quickTags = [
  { name: 'Articles', count: 23 },
  { name: 'Tools', count: 15 },
  { name: 'Inspiration', count: 8 },
  { name: 'Learning', count: 31 },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex flex-col bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700', className)}>
      <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-3 space-y-1">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Tags Section */}
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Tags
            </h3>
            <div className="mt-3 space-y-1">
              {quickTags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/bookmarks?tag=${encodeURIComponent(tag.name.toLowerCase())}`}
                  className="group flex items-center justify-between px-2 py-1 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  <span className="flex items-center">
                    <Tag className="mr-2 flex-shrink-0 h-4 w-4 text-gray-400" />
                    {tag.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {tag.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="mt-8">
            <Link
              href="/settings"
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === '/settings'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              )}
            >
              <Settings
                className={cn(
                  'mr-3 flex-shrink-0 h-5 w-5',
                  pathname === '/settings'
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                )}
              />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}