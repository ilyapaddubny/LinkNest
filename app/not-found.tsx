import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for. The link might be broken
            or the page may have been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/" className="block">
            <Button size="lg" className="w-full">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full"
          >
            <Button variant="outline" size="lg" className="w-full">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? Contact us at</p>
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