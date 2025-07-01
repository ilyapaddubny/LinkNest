import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Welcome to LinkNest
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          A friction‑free, cross‑device home for personal and shareable
          bookmarks that feels as quick as opening a new browser tab.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
