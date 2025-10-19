import React from "react";

export type Project = {
  id: string | number;
  title: string;
  description?: string;
  tags?: string[];
  creator?: {
    name: string;
    avatarUrl?: string | null;
  };
  membersCount?: number;
  skills?: string[];
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
  imageUrl?: string | null;
};

type Props = {
  project: Project;
};

/**
 Example project object:
 const project = {
  id: '1',
  title: 'Custom Memory Allocator',
  description: 'Build a custom memory allocation and deallocation system similar to malloc and free...',
  tags: ['Project'],
  creator: { name: 'biyon binu', avatarUrl: '/avatar.jpg' },
  membersCount: 1,
  skills: ['C', 'C++', 'Pointers', 'Memory Management', 'Linked Lists', 'OS Concepts'],
  actions: [{ label: 'Join Project', href: '#' }],
  imageUrl: null
 }

*/

export default function ProjectCard({ project }: Props) {
  return (
    <article className="max-w-sm bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="h-36 bg-gray-200 relative flex items-center justify-center">
        {project.imageUrl ? (
          // image cover
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-gray-400 text-sm">Image</div>
        )}
        {/* tag */}
        {project.tags && project.tags.length > 0 && (
          <div className="absolute left-3 top-3 bg-white/90 text-sm rounded-full px-3 py-1 shadow">
            {project.tags[0]}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {project.title}
            </h3>
            <p className="text-gray-600 mt-3 text-sm line-clamp-3">
              {project.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            {project.actions && project.actions[0] ? (
              <a
                href={project.actions[0].href ?? "#"}
                onClick={project.actions[0].onClick}
                className="inline-block bg-[#0f4f4a] text-white px-2 py-1 rounded-lg text-lg"
              >
                {project.actions[0].label}
              </a>
            ) : null}
          </div>
        </div>

        <div className=" flex items-center justify-between  pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              {/* creator avatar */}
              {project.creator && project.creator.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.creator.avatarUrl}
                  alt={project.creator.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="text-sm text-gray-400">
                  {project.creator ? project.creator.name.charAt(0) : "?"}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-500">Created by</div>
              <div className="text-sm font-semibold text-gray-800">
                {project.creator?.name}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {project.membersCount ?? 0} members
          </div>
        </div>

        {project.skills && project.skills.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="text-sm text-gray-500 mb-2">Skills needed</div>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s) => (
                <div
                  key={s}
                  className="px-1 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
