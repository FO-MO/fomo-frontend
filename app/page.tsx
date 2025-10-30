import TopBar from "@/components/bars/topBar";
import Hero1 from "@/components/hero/Hero1";
import Hero2 from "@/components/hero/Hero2";
import Hero3 from "@/components/hero/Hero3";
import Hero4 from "@/components/hero/Hero4";
import Hero5 from "@/components/hero/Hero5";
import Footer from "@/components/bars/footer";

const user = {
  name: "Simon Johnson",
  abbreviation: "SJ",
  userType: "student" as const,
  loggedIn: true,
};

export default function Home() {
  return (
    <>
      <TopBar theme="home" user={user} />
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Footer />
    </>
  );
}
