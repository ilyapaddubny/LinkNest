import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ArrowRight, Bookmark, Share2, Search, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const features = [
  {
    icon: Bookmark,
    title: 'Smart Bookmarking',
    description: 'Automatically fetch titles, descriptions, and images from any URL. Organize with tags and collections.',
  },
  {
    icon: Search,
    title: 'Powerful Search',
    description: 'Find your bookmarks instantly with full-text search across titles, descriptions, and tags.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share individual bookmarks or entire collections publicly with customizable privacy controls.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed with instant loading, offline support, and keyboard shortcuts for power users.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays private by default. Choose what to share and with whom on your own terms.',
  },
  {
    icon: Globe,
    title: 'Cross-Platform',
    description: 'Access your bookmarks anywhere - web, mobile, or via our API. Sync across all your devices.',
  },
];

const stats = [
  { label: 'Bookmarks Saved', value: '10K+' },
  { label: 'Active Users', value: '500+' },
  { label: 'Uptime', value: '99.9%' },
];

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-700/25" />
        <div className="container relative py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-6">
              🚀 Now in Beta - Join Early Adopters
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
              Your Personal{' '}
              <span className="gradient-text">Bookmark</span>{' '}
              Manager
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A friction-free, cross-device home for personal and shareable bookmarks 
              that feels as quick as opening a new browser tab.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signin">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-x-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Everything you need to manage your links
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Built for both casual users and power users, LinkNest provides all the tools 
              you need to save, organize, and share your favorite content.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/20">
                        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700">
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to organize your digital life?
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-100">
              Join thousands of users who have already made LinkNest their go-to bookmark manager.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signin">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  Start Bookmarking Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
