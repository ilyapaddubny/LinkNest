import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center space-x-2', className)}>
      <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-2">
        <Bookmark className={cn('text-white', sizeClasses[size])} />
      </div>
      {showText && (
        <span className={cn('font-bold text-gray-900 dark:text-white', textSizeClasses[size])}>
          LinkNest
        </span>
      )}
    </Link>
  );
}