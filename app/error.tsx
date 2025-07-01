'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Something went wrong!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We're sorry, but something unexpected happened. Our team has been notified
            and is working on a fix.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                {error.message}
                {error.stack && (
                  <>
                    {'\n\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={reset} size="lg" className="w-full">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Link href="/" className="block">
            <Button variant="outline" size="lg" className="w-full">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>If this problem persists, please contact us at</p>
          <a
            href="mailto:support@linknest.com"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            support@linknest.com
          </a>
        </div>
      </div>
    </div>
  );
}