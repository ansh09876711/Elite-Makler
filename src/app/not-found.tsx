import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center px-6">
          <p className="font-playfair text-8xl font-bold text-[#C5A880] mb-4">404</p>
          <h1 className="font-playfair text-3xl font-semibold text-[#11161E] mb-4">
            Page Not Found
          </h1>
          <p className="text-[#68717A] mb-8 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#C5A880] text-[#11161E] font-semibold text-sm
                         rounded hover:bg-[#A4855C] transition-all"
            >
              Go Home
            </Link>
            <Link
              href="/properties"
              className="px-6 py-3 border border-[#C5A880] text-[#C5A880] text-sm
                         font-medium rounded hover:bg-[#C5A880] hover:text-[#11161E]
                         transition-all"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
