import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome back, {session?.user?.name || session?.user?.email}!
      </p>
      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">Quick Stats</h2>
        <p className="mt-2 text-gray-600">
          Your bookmark statistics will appear here.
        </p>
      </div>
    </div>
  );
}
