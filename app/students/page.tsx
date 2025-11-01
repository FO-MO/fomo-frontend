import PostCard, { Post } from "@/components/student-section/PostCard";

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
        name: "Simon Mattekkatt",
        initials: "S",
      },
      postedAgo: "2 days ago",
      message: "car",
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
    },
    {
      id: "2",
      author: {
        name: "raghu reddy",
        initials: "r",
      },
      postedAgo: "3 months ago",
      message:
        "hey guys apply for this job role in FOOMO startup which is pretty cool to work.",
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
    },
  ],
};

export default function StudentsHomePage() {
  const { user, composer, postsSectionTitle, posts } = homePageData;

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        {/* Hero Header Section */}
        <header className="mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Welcome back, {user.name}! {user.greetingEmoji}
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
                <div className="flex-1">
                  <textarea
                    className="w-full min-h-[80px] resize-none border border-gray-300 focus:border-gray-500 focus:outline-none text-black placeholder:text-gray-500 px-3 py-2 rounded-md"
                    placeholder={composer.placeholder}
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-black">
                      <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
                          />
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 11l3 3 5-5"
                          />
                        </svg>
                        <span className="hidden sm:inline">Photo</span>
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                          />
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 10l5 5 5-7"
                          />
                        </svg>
                        <span className="hidden sm:inline">Video</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 rounded-md bg-gray-200 text-black font-medium hover:bg-gray-300 transition">
                        Cancel
                      </button>
                      <button className="px-4 py-2 rounded-md bg-black text-white font-medium hover:bg-gray-800 transition">
                        {composer.postLabel}
                      </button>
                    </div>
                  </div>
                </div>
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
