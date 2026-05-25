import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="app-shell flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p className="text-6xl mb-4">🍽️</p>
      <h1 className="text-3xl font-black text-primary-500 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 text-sm font-roboto mb-8">
        Looks like this page ran off with a delivery rider.
      </p>
      <Link href="/discover" className="btn-primary max-w-[200px]">
        Back to Discover
      </Link>
    </div>
  );
}
