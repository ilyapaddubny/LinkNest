import Link from 'next/link';

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification:
      'The verification token has expired or has already been used.',
    OAuthSignin: 'Error occurred while signing in with OAuth provider.',
    OAuthCallback: 'Error in handling the response from the OAuth provider.',
    OAuthCreateAccount: 'Could not create user account with OAuth provider.',
    EmailCreateAccount: 'Could not create user account with email provider.',
    Callback: 'Error in the OAuth callback handler route.',
    OAuthAccountNotLinked:
      'This email is already associated with another account. Please sign in with the original provider.',
    Default: 'An unexpected error occurred during authentication.',
  };

  const error = searchParams.error || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h1>
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
          <Link
            href="/auth/signin"
            className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
