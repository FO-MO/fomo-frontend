import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-1000 h-20 border-b border-white/40 bg-gradient-to-r from-[#cfd5df]/60 via-white/30 to-white/20 backdrop-blur-xl"
        role="banner"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="text-3xl font-semibold text-gray-900">
            FOMO
          </Link>

          <div className="flex items-center gap-6 text-gray-700">
            <div className="relative">
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-teal-500"
                aria-hidden="true"
              />
            </div>

            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-900">
              SM
            </div>
          </div>
        </div>
      </header>
      ;
    </>
  );
}
