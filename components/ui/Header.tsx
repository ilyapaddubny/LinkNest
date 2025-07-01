import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary-600">LinkNest</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary-600"
          >
            Dashboard
          </Link>
          <Link
            href="/bookmarks"
            className="text-sm font-medium transition-colors hover:text-primary-600"
          >
            Bookmarks
          </Link>
          <Link
            href="/public"
            className="text-sm font-medium transition-colors hover:text-primary-600"
          >
            Public
          </Link>
        </nav>
      </div>
    </header>
  );
}
