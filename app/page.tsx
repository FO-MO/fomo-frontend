import TopBar from "@/components/topBar";
import LandingSection from "@/components/landingSection";
import Footer from "@/components/footer";
import FomoAIpopup from "@/components/FomoAIpopup";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <TopBar theme="home" />
      <LandingSection />
      <div className="flex flex-col items-center justify-center h-[80vh] bg-red-500 text-center text-white">
        <h1 className="text-5xl font-bold mb-8">For Students</h1>
        <Link
          href="/students/search"
          className="bg-white text-red-500 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Explore Student Portal
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center h-[80vh] bg-indigo-900 text-center text-white">
        <h1 className="text-5xl font-bold mb-8">For Colleges</h1>
        <Link
          href="/colleges/dashboard"
          className="bg-white text-indigo-900 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Access College Dashboard
        </Link>
      </div>
      <h1 className="flex items-center justify-center h-[80vh] bg-amber-500 text-center text-5xl">
        section 3
      </h1>

      <Footer />
    </>
  );
}
