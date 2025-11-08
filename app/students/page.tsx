"use client";
import PostCard, { Post } from "@/components/student-section/PostCard";
import { useEffect, useState } from "react";

export type HomePageData = {
  user: {
    name: string;
    initials: string;
    greetingEmoji: string;
    subtitle: string;
  };
  composer: {
    placeholder: string;
    postLabel: string;
  };
  postsSectionTitle: string;
  posts: Post[];
};

const homePageData: HomePageData = {
  user: {
    name: "Simon Mattekkatt",
    initials: "S",
    greetingEmoji: "👋",
    subtitle: "Share your achievements and connect with your network",
  },
  composer: {
    placeholder: "What's on your mind?",
    postLabel: "Post",
  },
  postsSectionTitle: "Recent Posts",
  posts: [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        initials: "SC",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        title: "Software Engineering Intern @ Google",
      },
      postedAgo: "2 hours ago",
      message:
        "Excited to share that I just completed my first major project at Google! 🎉\n\nBuilt a real-time analytics dashboard that processes millions of events per second. Huge thanks to my amazing team for all the support and mentorship.\n\nKey learnings:\n• Scalability matters from day one\n• Code reviews are invaluable\n• Don't be afraid to ask questions\n\nFeeling grateful for this incredible opportunity! 🚀",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      ],
      stats: {
        likes: 127,
        comments: 23,
        shares: 8,
      },
      isLiked: true,
    },
    {
      id: "2",
      author: {
        name: "Alex Rodriguez",
        initials: "AR",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        title: "CS Student @ MIT | AI Research",
      },
      postedAgo: "5 hours ago",
      message:
        "Our hackathon team just won 1st place at HackMIT! 🏆\n\nWe built an AI-powered study assistant that helps students learn more effectively. 24 hours of coding, debugging, and way too much caffeine, but totally worth it!\n\nShoutout to my incredible teammates - couldn't have done it without you all! 💪",
      images: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      ],
      stats: {
        likes: 243,
        comments: 45,
        shares: 19,
      },
    },
    {
      id: "3",
      author: {
        name: "Priya Sharma",
        initials: "PS",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        title: "Product Designer | UX Enthusiast",
      },
      postedAgo: "1 day ago",
      message:
        "Just wrapped up a 3-month design internship at Airbnb! Here are some highlights from my portfolio work.\n\nLearned so much about user research, design systems, and cross-functional collaboration. The experience has been absolutely transformative for my career.\n\nAlways happy to chat about design, internships, or career advice! Feel free to reach out. ✨",
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
      ],
      stats: {
        likes: 189,
        comments: 31,
        shares: 12,
      },
    },
    {
      id: "4",
      author: {
        name: "Marcus Johnson",
        initials: "MJ",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        title: "Startup Founder | Tech Entrepreneur",
      },
      postedAgo: "2 days ago",
      message:
        "Big news! Our startup just raised a $2M seed round! 🎊\n\nIt's been an incredible journey from dorm room idea to where we are today. To everyone who believed in us, supported us, and joined us on this ride - thank you from the bottom of my heart.\n\nThis is just the beginning. We're hiring across engineering, product, and marketing. DM me if you're interested in joining our mission to revolutionize education tech!\n\n#StartupLife #SeedRound #EdTech #Hiring",
      images: [
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
      ],
      stats: {
        likes: 456,
        comments: 87,
        shares: 34,
      },
      isLiked: true,
    },
    {
      id: "5",
      author: {
        name: "Emily Zhang",
        initials: "EZ",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
        title: "Data Science @ Stanford | ML Researcher",
      },
      postedAgo: "3 days ago",
      message:
        "Just published my first research paper on machine learning for climate prediction! 🌍📊\n\nAfter months of data collection, model training, and countless revisions, it's finally out there. This work could help predict extreme weather events more accurately.\n\nHuge thanks to my advisor and lab mates for their incredible support throughout this journey. Science is truly a team sport!\n\nLink to the paper in comments. Would love to hear your thoughts!",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
      ],
      stats: {
        likes: 312,
        comments: 56,
        shares: 28,
      },
    },
    {
      id: "6",
      author: {
        name: "David Kim",
        initials: "DK",
        title: "Business Student @ Harvard | Aspiring Entrepreneur",
      },
      postedAgo: "5 days ago",
      message:
        "Lessons learned from my summer internship at McKinsey:\n\n1. Communication is everything - being able to explain complex ideas simply is a superpower\n2. Always ask 'So what?' - insights without impact are just data\n3. Your network is your net worth - invest in relationships\n4. Embrace feedback - it's the fastest way to grow\n5. Work hard, but don't forget to take care of yourself\n\nTo anyone applying for consulting roles - feel free to reach out! Happy to share more about my experience and help with interview prep. 📈💼",
      stats: {
        likes: 98,
        comments: 15,
        shares: 6,
      },
    },
  ],
};

export default function StudentsHomePage() {
  const { user, composer, postsSectionTitle, posts } = homePageData;
  const [nameVal, setNameVal] = useState(user.name);

  useEffect(() => {
    // Compute initials from current user's name stored in localStorage
    try {
      const raw = localStorage.getItem("fomo_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Try common fields for name
        const name =
          (parsed && (parsed.name || parsed.username || parsed.email)) ||
          "User";
        // If email, strip domain
        const cleanedName =
          typeof name === "string" && name.includes("@")
            ? name.split("@")[0]
            : name;
        setNameVal(cleanedName);
      }
    } catch {
      setNameVal(user.name);
    }
  }, []);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        {/* Hero Header Section */}
        <header className="mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Welcome back, {nameVal}! {user.greetingEmoji}
            </h1>
            <p className="text-base text-black max-w-2xl">{user.subtitle}</p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Feed (2 cols on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Composer Card */}
            <section className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-black">
                  {user.initials}
                </div>
                <button
                  onClick={() =>
                    (window.location.href = "/students/posts/create")
                  }
                  className="flex-1 text-left"
                >
                  <div className="w-full min-h-[80px] border border-gray-300 hover:border-gray-500 text-gray-500 px-3 py-2 rounded-md flex items-start cursor-pointer transition-colors">
                    {composer.placeholder}
                  </div>
                </button>
              </div>
            </section>

            {/* Feed Section */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-black">
                {postsSectionTitle}
              </h2>
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Trending Section */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-black mb-3">
                Trending
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { tag: "#Internships", count: "2.5K posts" },
                  { tag: "#StartupLife", count: "1.8K posts" },
                  { tag: "#CareerGrowth", count: "3.2K posts" },
                  { tag: "#TechJobs", count: "4.1K posts" },
                ].map((trend, idx) => (
                  <button
                    key={idx}
                    className="text-left p-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-black">{trend.tag}</p>
                    <p className="text-sm text-gray-600">{trend.count}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-black mb-3">
                People You Know
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Alex Johnson", role: "Product Manager" },
                  { name: "Sarah Chen", role: "UX Designer" },
                  { name: "Mike Patel", role: "Full Stack Dev" },
                ].map((person, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-black text-sm">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-600">{person.role}</p>
                    </div>
                    <button className="px-3 py-1 text-xs font-medium rounded-md bg-black text-white hover:bg-gray-800 transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-black mb-3">
                Your Activity
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 rounded-md p-3 text-center">
                  <p className="text-xl font-semibold text-black">24</p>
                  <p className="text-xs text-gray-600">Connections</p>
                </div>
                <div className="bg-gray-100 rounded-md p-3 text-center">
                  <p className="text-xl font-semibold text-black">8</p>
                  <p className="text-xs text-gray-600">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
