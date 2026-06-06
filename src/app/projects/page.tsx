import { siteConfig } from '@/lib/constants'

export const metadata = {
  title: 'Projects',
}

export default function ProjectsPage() {
  const { projects } = siteConfig

  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold text-text-dark mb-2">Projects</h1>
      <p className="text-text-secondary text-sm mb-8">Things I&apos;ve built.</p>

      {projects.length === 0 ? (
        <p className="text-text-secondary">No projects yet.</p>
      ) : (
        <div className="space-y-5">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.04)] hover:border-brand/30 hover:shadow-md transition-all no-underline"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0 mt-1">{project.icon}</span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-text-dark mb-2">
                    {project.name}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 bg-brand/5 text-brand rounded-full font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
