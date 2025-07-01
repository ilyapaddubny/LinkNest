import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { auth } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkNest - Your Personal Bookmark Manager',
  description:
    'A friction‑free, cross‑device home for personal and shareable bookmarks that feels as quick as opening a new browser tab.',
  openGraph: {
    title: 'LinkNest - Your Personal Bookmark Manager',
    description: 'Save, organize, and share your favorite links with ease.',
    type: 'website',
    url: 'https://linknest.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkNest - Your Personal Bookmark Manager',
    description: 'Save, organize, and share your favorite links with ease.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation 
              user={session?.user} 
              onSignOut={() => {
                // This will be handled client-side
              }} 
            />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
