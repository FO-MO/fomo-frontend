
const userProfile = {
  name: "Simon Mattekkatt",
  email: "robertcresol@gmail.com",
  initials: "SM",
  skills: [],
  interests: [],
  followers: 0,
  following: 0,
  tabs: [
    { key: "projects", label: "Projects" },
    { key: "clubs", label: "Clubs" },
    { key: "internships", label: "Internships" }
  ],
  activeTab: "projects",
  projects: [
    {
      title: "EcoTrack Mobile App",
      description: "Building an app that helps users track and reduce their carbon footprint",
      status: "Active",
      tags: ["React Native", "UI/UX Design"]
    },
    {
      title: "College Resource Finder",
      description: "Web app that aggregates and organizes university resources for students",
      status: "Completed",
      tags: ["React", "Firebase", "Tailwind CSS"]
    }
  ]
};

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full h-32 bg-gradient-to-r from-gray-200 to-gray-300" />
      <div className="max-w-5xl mx-auto -mt-16 flex gap-8">
        {/* Left: Avatar and main info */}
        <div className="flex-1">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
              {userProfile.initials}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1">{userProfile.name}</h1>
              <div className="text-gray-500 text-lg">@{userProfile.email}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex gap-2 bg-gray-100 rounded-xl p-2 w-full max-w-xl">
              {userProfile.tabs.map(tab => (
                <button
                  key={tab.key}
                  className={`px-5 py-2 rounded-lg font-medium text-base transition-all duration-100 ${userProfile.activeTab === tab.key ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          {userProfile.activeTab === "projects" && (
            <div className="mt-6 flex flex-col gap-6">
              {userProfile.projects.map((proj, idx) => (
                <div key={proj.title + idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-semibold">{proj.title}</h2>
                    <span className={`px-4 py-1 rounded-full font-semibold text-sm ${proj.status === 'Active' ? 'bg-[#185c5a] text-white' : 'bg-gray-100 text-gray-700'}`}>{proj.status}</span>
                  </div>
                  <div className="text-gray-700 mb-3">{proj.description}</div>
                  <div className="flex gap-2 flex-wrap">
                    {proj.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Skills, Interests, Followers */}
        <div className="w-72 pt-24">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Skills</h3>
            {/* List skills here if any */}
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Interests</h3>
            {/* List interests here if any */}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-700 font-medium mb-2">
              <span>Followers</span>
              <span>{userProfile.followers}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Following</span>
              <span>{userProfile.following}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
