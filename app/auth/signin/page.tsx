import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SignInForm from '@/components/auth/SignInForm';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await auth();

  if (session) {
    redirect(searchParams.callbackUrl || '/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to LinkNest
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Save and organize your favorite links
          </p>
        </div>
        {searchParams.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {searchParams.error === 'OAuthAccountNotLinked'
                ? 'This email is already linked to another account. Please sign in with the original provider.'
                : 'An error occurred during sign in. Please try again.'}
            </p>
          </div>
        )}
        <SignInForm callbackUrl={searchParams.callbackUrl || undefined} />
      </div>
    </div>
  );
}
