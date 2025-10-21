import TopBar from "@/components/topBar";
import LandingSection from "@/components/landingSection";
import Footer from "@/components/footer";
import FomoAIpopup from "@/components/FomoAIpopup";

export default function Home() {
  return (
    <>
      <TopBar theme="black" />
      <LandingSection />
      <h1 className="flex items-center justify-center h-[80vh] bg-red-500 text-center text-5xl">
        section 1
      </h1>
      <h1 className="flex items-center justify-center h-[80vh] bg-indigo-900 text-center text-5xl">
        section 2
      </h1>
      <h1 className="flex items-center justify-center h-[80vh] bg-amber-500 text-center text-5xl">
        section 3
      </h1>

      <Footer />
    </>
  );
}
