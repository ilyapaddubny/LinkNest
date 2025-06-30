export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-bold text-center mb-8">
          Welcome to LinkNest
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
          A friction‑free, cross‑device home for personal and shareable bookmarks
          that feels as quick as opening a new browser tab.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Get Started
          </button>
          <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}