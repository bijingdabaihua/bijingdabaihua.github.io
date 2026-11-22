import Link from 'next/link'
import type { Project } from '@/types'

export default function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group flex flex-col justify-between rounded-2xl border border-border-light bg-surface/40 p-6 no-underline transition-colors hover:border-text-secondary/40 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-text-faint">
          <span>{String(index).padStart(2, '0')}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </div>
        <h3 className="mt-8 text-xl font-medium tracking-tight text-text-primary">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {project.description}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border-light px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  )
}
