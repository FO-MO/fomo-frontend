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
        "hey guys apply for this job role in fomo startup which is pretty cool to work.",
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
    <main className="w-full px-6 sm:px-8 pt-8 pb-16 bg-gray-50">
      <section className="max-w-3xl mx-auto flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}! {user.greetingEmoji}
          </h1>
          <p className="text-gray-500 mt-1">{user.subtitle}</p>
        </header>

        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
              {user.initials}
            </div>
            <textarea
              className="flex-1 min-h-[100px] border-none resize-none focus:outline-none text-gray-700 placeholder:text-gray-400"
              placeholder={composer.placeholder}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 5.25v13.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75V5.25z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15l6-6 4 4 5-5 3 3"
                />
              </svg>
              Add photo
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded-full bg-[#879EA2] text-white font-semibold hover:bg-[#6f878b] transition"
            >
              {composer.postLabel}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {postsSectionTitle}
          </h2>
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
