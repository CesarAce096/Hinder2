import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-red-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Hinder2</h1>
        <p className="text-xl mb-8">Find your perfect match</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-pink-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-pink-500 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}