import TopBar from "@/components/bars/topBar";
import Hero1 from "@/components/hero/Hero1";
import Hero2 from "@/components/hero/Hero2";
import Hero3 from "@/components/hero/Hero3";
import Footer from "@/components/bars/footer";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <TopBar theme="home" />
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <div className="flex flex-col  items-center justify-center h-[80vh] bg-indigo-900 text-center text-white">
        <h1 className="text-5xl font-bold mb-8">For Colleges</h1>
        <Link
          href="/colleges/dashboard"
          className="bg-white text-indigo-900 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Access College Dashboard
        </Link>
      </div>

      <section className="w-full bg-[#0f4f4a] text-white border-b-1 border-gray-400/35  py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Hired?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of students already using AI to land their dream jobs
            through automated upskilling and networking.
          </p>
          <Link href="/auth/signup">
            <button className="group relative bg-[#d6ff3a] text-[#082926] font-bold px-8 py-4 rounded-lg text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(214,255,58,0.4)] hover:-translate-y-1">
              <span className="flex items-center gap-2">
                Get Started Now
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
