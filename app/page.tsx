import Link from "next/link";

//UDAYIPP SETUP TO NAVIGATE EASILY FOR NOW
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to FOMO
        </h1>
        <div className="space-y-4">
          <Link
            href="/students/search"
            className="block bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-teal-800 transition-colors"
          >
            Find People
          </Link>
          <Link
            href="/students/clubs"
            className="block bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-800 transition-colors"
          >
            Browse Clubs
          </Link>
          <Link
            href="/students/projects"
            className="block bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-800 transition-colors"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
