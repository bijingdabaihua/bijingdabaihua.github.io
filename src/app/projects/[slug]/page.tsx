import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ButtonLink from '@/components/button-link'
import { siteConfig } from '@/lib/constants'
import type { Project } from '@/types'

type PageProps = {
  params: Promise<{ slug: string }>
}

function findProject(slug: string): Project | undefined {
  return siteConfig.projects.find((project) => project.slug === slug)
}

export const dynamicParams = false

export function generateStaticParams() {
  return siteConfig.projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)

  if (!project) return {}

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = findProject(slug)

  if (!project) notFound()

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-10 sm:px-8">
      <Link
        href="/#work"
        className="font-mono text-[11px] text-text-secondary no-underline transition-colors hover:text-text-primary"
      >
        ← 返回作品
      </Link>

      <header className="mt-12 max-w-[860px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Project / {project.slug}
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-text-primary">
          {project.name}
        </h1>

        <p className="mt-6 max-w-[680px] text-[16px] leading-7 text-text-secondary">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border-light px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demo && (
            <ButtonLink href={project.demo} variant="primary">
              在线 Demo ↗
            </ButtonLink>
          )}
          <ButtonLink
            href={project.url}
            variant={project.demo ? 'secondary' : 'primary'}
          >
            源码 ↗
          </ButtonLink>
        </div>
      </header>

      {project.cover && (
        <a
          href={project.demo ?? project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            project.demo
              ? `打开 ${project.name} 在线 Demo`
              : `打开 ${project.name} 源码`
          }
          className="mt-12 block overflow-hidden rounded-2xl border border-border-light bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Image
            src={project.cover}
            alt={`${project.name} 的项目截图`}
            width={1280}
            height={720}
            className="aspect-[16/9] w-full object-cover"
          />
        </a>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <section className="mt-20 grid gap-8 border-t border-border-light pt-10 lg:grid-cols-[240px_1fr]">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Technical Notes
            </h2>
            <p className="mt-3 max-w-[200px] text-sm leading-6 text-text-secondary">
              实现时真正花时间的地方。
            </p>
          </div>

          <ul className="space-y-5">
            {project.highlights.map((highlight, index) => (
              <li
                key={highlight}
                className="grid grid-cols-[32px_1fr] gap-3 text-[15px] leading-7 text-text-secondary"
              >
                <span className="pt-1 font-mono text-[11px] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.demo && (
        <section className="mt-16 rounded-2xl border border-border-light bg-surface p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
            Try it
          </p>
          <h2 className="mt-3 text-xl font-medium text-text-primary">
            需要支持 WebGPU 的浏览器
          </h2>
          <p className="mt-2 max-w-[620px] text-sm leading-6 text-text-secondary">
            Chrome / Edge 113+，或已开启 WebGPU 的 Safari。首次打开要下载并解码几十 MB 的场景资产，加载完成后画面会持续累积变干净。
          </p>
          <div className="mt-5">
            <ButtonLink href={project.demo} variant="primary">
              打开在线 Demo ↗
            </ButtonLink>
          </div>
        </section>
      )}

      <div className="mt-16 flex items-center justify-between border-t border-border-light pt-6">
        <Link
          href="/#work"
          className="font-mono text-[11px] text-text-secondary no-underline transition-colors hover:text-text-primary"
        >
          ← 所有作品
        </Link>
        <Link
          href="/writing/"
          className="font-mono text-[11px] text-text-secondary no-underline transition-colors hover:text-text-primary"
        >
          技术笔记 →
        </Link>
      </div>
    </div>
  )
}
